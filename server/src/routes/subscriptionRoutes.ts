import { Router } from 'express';
import { getSubscriptionPlans, subscribeToPlan, getUserSubscriptions } from '../controllers/subscriptionController';
import { requireAuth, optionalAuth } from '../middlewares/auth';

const router = Router();

router.get('/plans', optionalAuth, getSubscriptionPlans);
router.post('/subscribe', requireAuth, subscribeToPlan);
router.get('/my-subscriptions', requireAuth, getUserSubscriptions);

export default router;
