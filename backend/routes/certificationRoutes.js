import express from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getCertifications)
  .post(protect, upload.single('logo'), createCertification);

router.route('/:id')
  .put(protect, upload.single('logo'), updateCertification)
  .delete(protect, deleteCertification);

export default router;
