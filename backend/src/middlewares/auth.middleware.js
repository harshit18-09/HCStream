import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
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
        throw new ApiError(401, "Unauthorized access - invalid token");
    }
});