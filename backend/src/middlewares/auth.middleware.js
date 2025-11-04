import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // Global opt-out: if DISABLE_AUTH=true is set, bypass authentication entirely.
    // This is intended as an emergency/dev escape hatch. Use with caution.
    if (String(process.env.DISABLE_AUTH || '').toLowerCase() === 'true') {
        // try to attach a user for downstream handlers; fall back to null
        try {
            const user = await User.findOne().select("-password -refreshToken");
            if (user) req.user = user;
        } catch (e) {
            // ignore db errors and proceed without user
        }
        return next();
    }
    try {
        // Try Authorization header first (Bearer <token>), fall back to cookie for compatibility
        const authHeader = req.header?.("Authorization") || req.headers?.authorization;
        let token = null;

        if (authHeader) {
            // support formats: "Bearer <token>", "bearer <token>", or just the token
            const parts = String(authHeader).split(" ").filter(Boolean);
            if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
                token = parts[1];
            } else if (parts.length === 1) {
                token = parts[0];
            }
        }

        // If header not provided, try cookie (keep existing cookie logic unchanged)
        if (!token) {
            token = req.cookies?.accessToken || null;
        }

        if (!token) {
            // No token present. Before rejecting, allow a development-only bypass.
            // This is intentionally guarded so it won't run in production.
            const bypassRequested = (process.env.NODE_ENV || 'development') !== 'production' &&
                (String(req.header?.('X-Bypass-Auth') || req.headers?.['x-bypass-auth'] || '').toLowerCase() === 'true');

            if (bypassRequested) {
                // Try to set req.user to a valid user. Prefer explicit user id header.
                const bypassUserId = req.header?.('X-Bypass-User-Id') || req.headers?.['x-bypass-user-id'];
                let user = null;
                if (bypassUserId) {
                    try {
                        user = await User.findById(bypassUserId).select("-password -refreshToken");
                    } catch (e) {
                        user = null;
                    }
                }

                if (!user) {
                    // fallback: pick first user in DB (useful for local testing only)
                    user = await User.findOne().select("-password -refreshToken");
                }

                if (user) {
                    req.user = user;
                    return next();
                }
            }

            throw new ApiError(401, "Access token is missing or invalid");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "User not found or does not exist");
        }

        req.user = user;
        next();
    } catch (err) {
        // If verification fails, allow a development-only bypass when requested.
        const bypassRequested = (process.env.NODE_ENV || 'development') !== 'production' &&
            (String(req.header?.('X-Bypass-Auth') || req.headers?.['x-bypass-auth'] || '').toLowerCase() === 'true');

        if (bypassRequested) {
            const bypassUserId = req.header?.('X-Bypass-User-Id') || req.headers?.['x-bypass-user-id'];
            let user = null;
            if (bypassUserId) {
                try {
                    user = await User.findById(bypassUserId).select("-password -refreshToken");
                } catch (e) {
                    user = null;
                }
            }

            if (!user) {
                user = await User.findOne().select("-password -refreshToken");
            }

            if (user) {
                req.user = user;
                return next();
            }
        }

        throw new ApiError(401, "Unauthorized access - invalid token");
    }
});