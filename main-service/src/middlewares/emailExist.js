const { validationResult } = require('express-validator');
const _get = require('lodash/get');
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
  if (!user) {
    return next();
  }

  const prevUserId = _get(req, 'body.id');
  const foundUserId = _get(user, 'id');

  // previous user data, should be valid
  if (prevUserId === foundUserId) {
    return next();
  }

  if (user && prevUserId !== foundUserId) {
    return res
      .status(409)
      .json({ error: true, errorMessage: 'Email already exist' });
  }

  return next();
}

module.exports = checkEmailExist;
