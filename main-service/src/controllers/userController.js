const { validationResult } = require('express-validator');
const userService = require('../services/userService');

async function signUp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ error: true, errorMessage: JSON.stringify(errors.array()) });
    return;
  }

  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error.toString() });
  }
}

module.exports = {
  signUp
};
