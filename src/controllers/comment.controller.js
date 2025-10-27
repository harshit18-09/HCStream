import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;
    const comments = await Comment.find({video: videoId})
        .skip((page - 1) * limit)
        .limit(limit)

    res.status(200).json(new ApiResponse(comments));
});

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {content} = req.body;
    const newComment = new Comment({
        video: videoId,
        user: req.user._id,
        content
    })

    await newComment.save()
    res.status(201).json(new ApiResponse(newComment));
});

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {content}, {new: true});
    if (!updatedComment) {
        throw new ApiError(404, "Comment not found");
    }

    res.status(200).json(new ApiResponse(updatedComment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
        throw new ApiError(404, "Comment not found");
    }

    res.status(200).json(new ApiResponse(deletedComment));
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}