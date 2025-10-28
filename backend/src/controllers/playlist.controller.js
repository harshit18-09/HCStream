import {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    const newPlaylist = new Playlist({
        name,
        description,
        owner: req.user._id
    })

    await newPlaylist.save()
    res.status(201).json(new ApiResponse(201, newPlaylist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const playlists = await Playlist.find({ owner: userId });
    res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    playlist.videos.push(videoId);
    await playlist.save();
    res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    playlist.videos.pull(videoId);
    await playlist.save();
    res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const requestUserId = req.user?._id?.toString();
    const playlistOwnerId = playlist.owner?.toString();
    if (!requestUserId || playlistOwnerId !== requestUserId) {
        throw new ApiError(403, "You are not allowed to delete this playlist");
    }

    await playlist.deleteOne();

    res.status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {name, description} = req.body;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if(!name && !description) {
        throw new ApiError(400, "Nothing to update");
    }
    const updates = {};
    if (typeof name === "string" && name.trim().length) {
        updates.name = name.trim();
    }
    if (typeof description === "string" && description.trim().length) {
        updates.description = description.trim();
    }
    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "Nothing to update");
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user?._id
        },
        { $set: updates },
        { new: true }
    );

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or no permission to update it");
    }

    res.status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}