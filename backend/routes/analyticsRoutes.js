import express from 'express';
import { trackPageView, getAnalyticsSummary } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/track', trackPageView);
router.get('/summary', protect, adminOnly, getAnalyticsSummary);

export default router;
