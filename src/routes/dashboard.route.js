import {Router} from 'express';
import {
    getChannelStats,
    getChannelVideos
} from '../controllers/dashboard.controller.js';
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get('/channel/:id/stats', getChannelStats);
router.get('/channel/:id/videos', getChannelVideos);

export default router;