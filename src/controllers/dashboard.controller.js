import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
    const totalVideos = await Video.countDocuments({channel: channelId});
    const totalSubscribers = await Subscription.countDocuments({channel: channelId});
    const totalLikes = await Like.countDocuments({video: { $in: await Video.find({channel: channelId}).select('_id') }});

    res.status(200).json(new ApiResponse({
        totalVideos,
        totalSubscribers,
        totalLikes
    }))
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
    const {page = 1, limit = 10} = req.query;
    const videos = await Video.find({channel: channelId})
        .skip((page - 1) * limit)
        .limit(limit);
    res.status(200).json(new ApiResponse(videos));
});

export {
    getChannelStats, 
    getChannelVideos
}