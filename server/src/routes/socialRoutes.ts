import { Router } from 'express';
import {
  toggleLike,
  getComments,
  addComment,
  toggleSave,
  toggleFollow,
  submitReport,
  recordShare
} from '../controllers/socialController';
import { requireAuth, optionalAuth } from '../middlewares/auth';

const router = Router();

router.post('/like', requireAuth, toggleLike);
router.get('/comments/:videoId', optionalAuth, getComments);
router.post('/comments', requireAuth, addComment);
router.post('/save', requireAuth, toggleSave);
router.post('/follow', requireAuth, toggleFollow);
router.post('/share', optionalAuth, recordShare);
router.post('/report', requireAuth, submitReport);

export default router;
