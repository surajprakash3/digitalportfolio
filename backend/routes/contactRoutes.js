import express from 'express';
import {
  submitContact,
  getContacts,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getContacts)
  .post(submitContact);

router.route('/:id')
  .delete(protect, deleteContact);

export default router;
