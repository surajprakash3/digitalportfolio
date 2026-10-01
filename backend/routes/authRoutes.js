import express from 'express';
import { registerUser, loginUser, getMe, seedAdmin, resetAdminPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/seed-admin', seedAdmin);
router.post('/reset-admin', resetAdminPassword);

export default router;
