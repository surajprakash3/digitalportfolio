import express from 'express';
import {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
} from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getSocials)
  .post(protect, upload.single('icon'), createSocial);

router.route('/:id')
  .put(protect, upload.single('icon'), updateSocial)
  .delete(protect, deleteSocial);

export default router;
