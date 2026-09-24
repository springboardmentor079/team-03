const multer = require('multer');
const path = require('path');
const fs = require('fs');

let cloudinary, CloudinaryStorage;
try {
  cloudinary = require('cloudinary').v2;
  const multerCloudinary = require('multer-storage-cloudinary');
  CloudinaryStorage = multerCloudinary.CloudinaryStorage;
} catch (e) {
  cloudinary = null;
  CloudinaryStorage = null;
}

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

let storage = localStorage;

if (cloudinary && process.env.CLOUDINARY_URL) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'buildtrack/documents',
      allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'xlsx', 'txt'],
      resource_type: 'auto'
    },
  });
}

// Configure Multer with max file size limit (10MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Cloud storage upload helper (AWS S3 or Cloudinary integration fallback)
 * @param {Object} file - Multer file object
 * @returns {String} Public file URL
 */
const getPublicFileUrl = (file) => {
  if (!file) return null;
  // If S3 or Cloudinary URL was attached, return it, otherwise fallback to local path
  if (file.location) return file.location; // S3
  if (file.path && file.path.startsWith('http')) return file.path; // Cloudinary
  return `/uploads/documents/${file.filename}`;
};

module.exports = { upload, getPublicFileUrl };

