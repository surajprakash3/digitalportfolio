import express from 'express';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getExperiences)
  .post(protect, upload.single('logo'), createExperience);

router.route('/:id')
  .put(protect, upload.single('logo'), updateExperience)
  .delete(protect, deleteExperience);

export default router;
