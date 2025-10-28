import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    if (res.headersSent) {
        throw new ApiError(500, "Headers already sent");
    }
    res.status(200).json(new ApiResponse({ message: "OK" }));
});

export {
    healthcheck
}