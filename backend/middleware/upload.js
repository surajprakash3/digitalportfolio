import multer from 'multer';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

let upload;

if (isCloudinaryConfigured) {
  // Use Cloudinary storage
  const { upload: cloudinaryUpload } = await import('../config/cloudinary.js');
  upload = cloudinaryUpload;
} else {
  // Fallback to local disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      cb(null, `${uniqueSuffix}.${ext}`);
    },
  });
  upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Allow all file formats as requested
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
  console.log('⚠️  Cloudinary not configured — using local file storage for uploads.');
}

export default upload;
