import express from 'express';
import {
  getPublishedPosts,
  getPostBySlug,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getPublishedPosts);
router.get('/admin/all', protect, adminOnly, getAllPosts);
router.get('/:slug', getPostBySlug);

// Admin routes
router.post('/', protect, adminOnly, upload.single('coverImage'), createPost);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

export default router;
