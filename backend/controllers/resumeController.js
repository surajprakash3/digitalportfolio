import asyncHandler from 'express-async-handler';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESUME_DIR = path.join(__dirname, '..', 'uploads', 'resume');

// Ensure resume directory exists
if (!fs.existsSync(RESUME_DIR)) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}

// @desc    Download current resume
// @route   GET /api/resume/download
// @access  Public
const downloadResume = asyncHandler(async (req, res) => {
  const files = fs.readdirSync(RESUME_DIR).filter(f => 
    f.endsWith('.pdf') || f.endsWith('.doc') || f.endsWith('.docx')
  );

  if (files.length === 0) {
    res.status(404);
    throw new Error('No resume file available');
  }

  // Get the most recently modified file
  const latest = files
    .map(f => ({ name: f, time: fs.statSync(path.join(RESUME_DIR, f)).mtime }))
    .sort((a, b) => b.time - a.time)[0];

  const filePath = path.join(RESUME_DIR, latest.name);
  res.download(filePath, `Suraj_Jha_Resume${path.extname(latest.name)}`);
});

// @desc    Upload resume
// @route   POST /api/resume/upload
// @access  Private/Admin
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Remove old resume files
  const existingFiles = fs.readdirSync(RESUME_DIR).filter(f => 
    f.endsWith('.pdf') || f.endsWith('.doc') || f.endsWith('.docx')
  );
  existingFiles.forEach(f => {
    const fPath = path.join(RESUME_DIR, f);
    if (fPath !== req.file.path) {
      fs.unlinkSync(fPath);
    }
  });

  res.status(201).json({ 
    message: 'Resume uploaded successfully',
    filename: req.file.originalname,
  });
});

// @desc    Check if resume exists
// @route   GET /api/resume/status
// @access  Public
const getResumeStatus = asyncHandler(async (req, res) => {
  const files = fs.readdirSync(RESUME_DIR).filter(f => 
    f.endsWith('.pdf') || f.endsWith('.doc') || f.endsWith('.docx')
  );
  
  res.json({ 
    available: files.length > 0,
    filename: files.length > 0 ? files[0] : null,
  });
});

export { downloadResume, uploadResume, getResumeStatus };
