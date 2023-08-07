const multer = require('multer');
const { sanitizeFile, TMP_IMAGES } = require('../utils/fileUpload');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, TMP_IMAGES);
  },
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.fieldname}_${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

module.exports = {
  upload
};
