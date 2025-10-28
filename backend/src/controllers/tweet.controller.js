import { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const trimmedContent = typeof content === "string" ? content.trim() : "";

    if (!trimmedContent) {
        throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.create({
        content: trimmedContent,
        owner: req.user._id
    });
    res.status(201).json(new ApiResponse(201, tweet, "Tweet created"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const trimmedContent = typeof content === "string" ? content.trim() : "";

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if (!trimmedContent) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user?._id
        },
        { $set: { content: trimmedContent } },
        { new: true }
    );

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you do not have permission to update it");
    }

    res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you do not have permission to delete it");
    }

    res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}