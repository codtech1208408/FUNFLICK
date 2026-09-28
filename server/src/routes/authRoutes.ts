import { Router } from 'express';
import { register, login, getCurrentUser, verifyOtp, requestPasswordReset, getProfileByUsername, updateProfile } from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', requestPasswordReset);
router.get('/me', requireAuth, getCurrentUser);
router.get('/profile/:username', getProfileByUsername);
router.put('/profile', requireAuth, updateProfile);

export default router;
