import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { transcribe } from '../controllers/aiController.js';
import { suggest } from '../controllers/aiController.js';

const router = Router();

// POST /api/ai/transcribe -> handled by controller
// uses multer middleware (single file field 'video')
router.post('/transcribe', upload.single('video'), transcribe);

// POST /api/v1/ai/suggest -> accepts optional 'reference' text and optional file 'thumbnail'
router.post('/suggest', upload.single('thumbnail'), suggest);

// Quick health check to confirm the AI router is mounted and reachable
router.get('/ping', (req, res) => {
	res.json({ ok: true, route: '/api/v1/ai/ping' });
});

export default router;
