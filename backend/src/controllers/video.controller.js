import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const parsePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildSortOptions = (sortBy = "createdAt", sortType = "desc") => {
    const allowedFields = new Set(["createdAt", "views", "duration", "title"]);
    const field = allowedFields.has(sortBy) ? sortBy : "createdAt";
    const direction = sortType === "asc" ? 1 : -1;
    return { 
        [field]: direction 
    };
};

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    const currentUserId = req.user?._id?.toString();
    const parsedPage = parsePositiveInt(page, 1);
    const parsedLimit = Math.min(parsePositiveInt(limit, 10), 50);

    const filter = {};
    const trimmedQuery = typeof query === "string" ? query.trim() : "";
    if (trimmedQuery) {
        const searchRegex = new RegExp(trimmedQuery, "i");
        filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    let ownerFilter;
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }
        ownerFilter = userId;
        filter.owner = ownerFilter;
    }

    const isRequestingOwnVideos =
        ownerFilter && currentUserId && ownerFilter.toString() === currentUserId;

    if (!isRequestingOwnVideos) {
        filter.isPublished = true;
    }

    const sortOptions = buildSortOptions(sortBy, sortType);

    const [videos, total] = await Promise.all([
        Video.find(filter)
            .sort(sortOptions)
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit)
            .populate("owner", "username fullname avatar"),
        Video.countDocuments(filter)
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                page: parsedPage,
                limit: parsedLimit,
                total,
                videos
            },
            "Videos fetched successfully"
        )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    const trimmedDescription = typeof description === "string" ? description.trim() : "";

    if (!trimmedTitle) {
        throw new ApiError(400, "Title is required");
    }
    if (!trimmedDescription) {
        throw new ApiError(400, "Description is required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path || req.file?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    if (!uploadedVideo?.url) {
        throw new ApiError(500, "Failed to upload video");
    }

    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail?.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const durationFromBody = Number(duration);
    const resolvedDuration = Number.isFinite(durationFromBody) && durationFromBody > 0
        ? durationFromBody
        : Number(uploadedVideo?.duration);

    if (!resolvedDuration) {
        throw new ApiError(400, "Duration is required");
    }

    const video = await Video.create({
        title: trimmedTitle,
        description: trimmedDescription,
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        duration: resolvedDuration,
        owner: req.user._id
    });

    return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "username fullname avatar");
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const videoOwnerId = video.owner?._id?.toString();
    const requesterId = req.user?._id?.toString();
    if (!video.isPublished && (!requesterId || requesterId !== videoOwnerId)) {
        throw new ApiError(403, "You are not allowed to view this video");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    const trimmedDescription = typeof description === "string" ? description.trim() : "";

    const updates = {};
    if (trimmedTitle) {
        updates.title = trimmedTitle;
    }
    if (trimmedDescription) {
        updates.description = trimmedDescription;
    }

    const newThumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (newThumbnailLocalPath) {
        const uploadedThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
        if (!uploadedThumbnail?.url) {
            throw new ApiError(500, "Failed to upload thumbnail");
        }
        updates.thumbnail = uploadedThumbnail.url;
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "Nothing to update");
    }

    const video = await Video.findOneAndUpdate(
        { _id: videoId, owner: req.user?._id },
        { $set: updates },
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found or you do not have permission to update it");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findOneAndDelete({
        _id: videoId,
        owner: req.user?._id
    });

    if (!video) {
        throw new ApiError(404, "Video not found or no permission");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user?._id
    });

    if (!video) {
        throw new ApiError(404, "Video not found or you do not have permission to update it");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    const message = video.isPublished
        ? "Video published successfully"
        : "Video unpublished successfully";

    return res
    .status(200)
    .json(new ApiResponse(200, video, message));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}