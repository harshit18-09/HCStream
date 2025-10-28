import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route('/').post(createPlaylist);
router.route('/:playlistId')
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);
router.route('/:playlistId/video/:videoId').patch(addVideoToPlaylist);
router.route('/:playlistId/video/:videoId/remove').patch(removeVideoFromPlaylist);
router.route('/user/:userId').get(getPlaylistById);

export default router;