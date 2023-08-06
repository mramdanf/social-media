const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

require('dotenv').config();

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION } =
  process.env;

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  },
  region: AWS_DEFAULT_REGION
});

const s3Storage = multerS3({
  s3,
  bucket: 'social-media-post-images',
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.fieldname}_${file.originalname}`;
    cb(null, fileName);
  }
});

const sanitizeFile = (file, cb) => {
  const fileExts = ['.png', '.jpg', '.jpeg', '.gif'];

  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  const isAllowedMimeType = file.mimetype.startsWith('image/');

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true);
  }

  return cb('Error: File type not allowed!');
};

// our middleware
const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 2 // 2mb file size
  }
});

module.exports = uploadImage;
