import {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }
    const userId = req.user._id
    const subscription = await Subscription.findOne({ subscriber: userId, channel: channelId })

    if (subscription) {
        await subscription.deleteOne()
        return res.status(200).json(new ApiResponse(200, null, "Unsubscribed from channel"))
    }

    await Subscription.create({ subscriber: userId, channel: channelId })
    res.status(200).json(new ApiResponse(200, null, "Subscribed to channel"))
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription
        .find({ channel: channelId })
        .populate("subscriber", "username email fullname avatar");
    res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate("channel");
    const channels = subscriptions.map(sub => sub.channel);
    res.status(200).json(new ApiResponse(200, channels, "Subscribed channels fetched"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}