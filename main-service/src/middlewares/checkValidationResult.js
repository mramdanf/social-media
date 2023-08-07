const { validationResult } = require('express-validator');
const _get = require('lodash/get');
const { deleteTmpImages } = require('../utils/fileUpload');

function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const file = _get(req, 'file.filename');
    if (file) {
      deleteTmpImages(file);
    }
    return res
      .status(400)
      .json({ error: true, errorMessage: errors.array()[0] });
  }

  return next();
}

module.exports = checkValidationResult;
