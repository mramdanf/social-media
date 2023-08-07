const path = require('path');
const fs = require('fs');

const TMP_IMAGES = 'src/tmp/images';

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

function tmpImagePathFactory(imageName) {
  return `${TMP_IMAGES}/${imageName}`;
}

function deleteTmpImages(imageName) {
  fs.unlinkSync(tmpImagePathFactory(imageName));
}

module.exports = {
  sanitizeFile,
  deleteTmpImages,
  tmpImagePathFactory,
  TMP_IMAGES
};
