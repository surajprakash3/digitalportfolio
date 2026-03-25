import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadResume, uploadResume, getResumeStatus } from '../controllers/resumeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local multer storage for resume files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'resume'));
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const resumeUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = express.Router();

router.get('/download', downloadResume);
router.get('/status', getResumeStatus);
router.post('/upload', protect, adminOnly, resumeUpload.single('resume'), uploadResume);

export default router;
