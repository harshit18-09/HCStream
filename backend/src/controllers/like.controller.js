import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({ video: videoId, user: req.user._id });
    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(new ApiResponse({ message: "Video unliked" }));
    }

    const newLike = new Like({ video: videoId, user: req.user._id });
    await newLike.save();
    res.status(201).json(new ApiResponse(newLike));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({ comment: commentId, user: req.user._id });
    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(new ApiResponse({ message: "Comment unliked" }));
    }

    const newLike = new Like({ comment: commentId, user: req.user._id });
    await newLike.save();
    res.status(201).json(new ApiResponse(newLike));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({ tweet: tweetId, user: req.user._id });
    if (existingLike) {
        await existingLike.remove();
        return res.status(200).json(new ApiResponse({ message: "Tweet unliked" }));
    }

    const newLike = new Like({ tweet: tweetId, user: req.user._id });
    await newLike.save();
    res.status(201).json(new ApiResponse(newLike));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({ user: req.user._id, video: { $ne: null } }).populate('video');
    const videos = likedVideos.map(like => like.video);
    res.status(200).json(new ApiResponse(videos));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}