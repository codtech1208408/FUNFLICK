import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getNotifications);
router.patch('/:id/read', requireAuth, markAsRead);

export default router;
