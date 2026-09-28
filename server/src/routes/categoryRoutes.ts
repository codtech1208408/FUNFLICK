import { Router } from 'express';
import { getCategories, getTrendingHashtags, globalSearch, createCategory } from '../controllers/categoryController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getCategories);
router.get('/hashtags/trending', getTrendingHashtags);
router.get('/search', globalSearch);
router.post('/', requireAuth, requireRole(['ADMIN']), createCategory);

export default router;
