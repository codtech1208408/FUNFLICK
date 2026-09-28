import { Router } from 'express';
import { getFeed, getReels, getVideoById, recordWatch } from '../controllers/videoController';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

router.get('/feed', optionalAuth, getFeed);
router.get('/reels', optionalAuth, getReels);
router.get('/:id', optionalAuth, getVideoById);
router.post('/:id/watch', optionalAuth, recordWatch);

export default router;
