const { validationResult } = require('express-validator');

function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ error: true, errorMessage: JSON.stringify(errors.array()) });
  }

  return next();
}

module.exports = checkValidationResult;
