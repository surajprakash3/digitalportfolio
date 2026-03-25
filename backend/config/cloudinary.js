import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isSvg = file.mimetype === 'image/svg+xml' || file.originalname.toLowerCase().endsWith('.svg');
    
    const params = {
      folder: 'portfolio',
      resource_type: 'image', // Must be 'image' so it serves with Content-Type: image/svg+xml
      transformation: isSvg ? [] : [{ width: 1200, crop: 'limit', quality: 'auto' }],
    };
    
    if (isSvg) {
      params.format = 'svg'; // Bypass multer format validation for vector graphics
      params.flags = 'sanitize'; // Allow XSS-safe delivery of raw SVGs 
    }
    
    return params;
  },
});

const upload = multer({ storage });

export { cloudinary, upload };
