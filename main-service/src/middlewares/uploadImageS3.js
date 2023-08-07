const multer = require('multer');
const multerS3 = require('multer-s3');
const { getS3Client, POST_IMAGES_BUCKET } = require('../services/S3Service');
const { sanitizeFile } = require('../utils/fileUpload');

const s3Storage = multerS3({
  s3: getS3Client(),
  bucket: POST_IMAGES_BUCKET,
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.fieldname}_${file.originalname}`;
    cb(null, fileName);
  }
});

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
