import express from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, upload.single('icon'), createSkill);

router.route('/:id')
  .put(protect, upload.single('icon'), updateSkill)
  .delete(protect, deleteSkill);

export default router;
