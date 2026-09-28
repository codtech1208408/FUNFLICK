import { Router } from 'express';
import {
  getAdminMetrics,
  getPendingVideos,
  moderateVideo,
  getCreatorApplications,
  reviewCreatorApplication,
  getUsersList,
  toggleUserStatus,
  getPayoutsList,
  processPayout,
  getReportsList,
  resolveReport
} from '../controllers/adminController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// All admin endpoints strictly require ADMIN role
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/metrics', getAdminMetrics);
router.get('/moderation/videos', getPendingVideos);
router.post('/moderation/videos/:videoId', moderateVideo);
router.get('/applications', getCreatorApplications);
router.post('/applications/:applicationId/review', reviewCreatorApplication);
router.get('/users', getUsersList);
router.patch('/users/:userId', toggleUserStatus);
router.get('/payouts', getPayoutsList);
router.post('/payouts/:payoutId/process', processPayout);
router.get('/reports', getReportsList);
router.post('/reports/:reportId/resolve', resolveReport);

export default router;
