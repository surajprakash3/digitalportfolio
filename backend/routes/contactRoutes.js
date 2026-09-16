import express from 'express';
import {
  submitContact,
  getContacts,
  deleteContact,
  markContactAsRead,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getContacts)
  .post(submitContact);

router.route('/:id')
  .delete(protect, deleteContact);

router.route('/:id/read')
  .put(protect, markContactAsRead);

export default router;
