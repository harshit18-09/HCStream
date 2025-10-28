import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} from '../controllers/comment.controller.js';
import {verifyJWT} from "../middlewares/verifyJWT.js";

const router = Router();

router.post('/:videoId', verifyJWT, addComment);
router.get('/:videoId', getVideoComments);
router.put('/:commentId', verifyJWT, updateComment);
router.delete('/:commentId', verifyJWT, deleteComment);

export default router;