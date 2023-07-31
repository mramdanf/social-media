const { validationResult } = require('express-validator');
const userService = require('../services/userService');

async function checkEmailExist(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ error: true, errorMessage: JSON.stringify(errors.array()) });
  }

  const { email } = req.body;

  const user = await userService.findUserByEmail(email);
  if (user) {
    return res
      .status(409)
      .json({ error: true, errorMessage: 'Email already exist' });
  }

  return next();
}

module.exports = checkEmailExist;
