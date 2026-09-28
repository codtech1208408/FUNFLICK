import { Router } from 'express';
import {
  applyForCreator,
  getCreatorDashboard,
  uploadContent,
  getCreatorVideos,
  updateCreatorVideo,
  deleteCreatorVideo,
  getCreatorEarnings,
  requestPayout
} from '../controllers/creatorController';
import { requireAuth, requireRole } from '../middlewares/auth';
import { uploadMedia } from '../middlewares/upload';

const router = Router();

// Apply to become a creator (Available to all users)
router.post('/apply', requireAuth, applyForCreator);

// Creator Studio Endpoints (Requires CREATOR or ADMIN role)
router.get('/dashboard', requireAuth, requireRole(['CREATOR', 'ADMIN']), getCreatorDashboard);
router.post('/upload', requireAuth, requireRole(['CREATOR', 'ADMIN']), uploadContent);
router.get('/videos', requireAuth, requireRole(['CREATOR', 'ADMIN']), getCreatorVideos);
router.patch('/videos/:id', requireAuth, requireRole(['CREATOR', 'ADMIN']), updateCreatorVideo);
router.delete('/videos/:id', requireAuth, requireRole(['CREATOR', 'ADMIN']), deleteCreatorVideo);
router.get('/earnings', requireAuth, requireRole(['CREATOR', 'ADMIN']), getCreatorEarnings);
router.post('/payouts/request', requireAuth, requireRole(['CREATOR', 'ADMIN']), requestPayout);

// Direct file upload endpoint
router.post('/upload-file', requireAuth, requireRole(['CREATOR', 'ADMIN']), uploadMedia.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${req.file.filename}`;
  return res.json({
    success: true,
    fileUrl,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

export default router;
