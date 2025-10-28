import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get('/liked', getLikedVideos);
router.post('/video/:id/toggle', toggleVideoLike);
router.post('/comment/:id/toggle', toggleCommentLike);
router.post('/tweet/:id/toggle', toggleTweetLike);

export default router;
