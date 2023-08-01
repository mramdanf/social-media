const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { bcryptCompare } = require('../utils/encriptions');
require('dotenv').config();

async function signUp(req, res) {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(200).json({
      error: false,
      message: 'Signup successfull!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error.toString() });
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ error: true, errorMessage: JSON.stringify(errors.array()) });
    return;
  }

  try {
    const userPayload = req.body;
    const user = await userService.findUserByEmail(userPayload.email);

    if (!user) {
      res.status(401).json({ error: true, errorMessage: 'Invalid credential' });
      return;
    }

    const validPassword = await bcryptCompare(
      userPayload.password,
      user.password
    );

    if (!validPassword) {
      res.status(401).json({ error: true, errorMessage: 'Invalid credential' });
      return;
    }

    const token = jwt.sign(
      { _id: user._id },
      `${process.env.MAIN_SERVICE_JWT_PRIVATE_KEY}`,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      error: false,
      message: 'login success!',
      user: {
        id: user._id,
        fullName: user.fullName,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error.toString() });
  }
}

async function update(req, res) {
  try {
    if (req._id !== req.body.id) {
      return res
        .status(403)
        .json({ error: true, errorMessage: 'Invalid user id' });
    }

    const result = await userService.updateUser(req.body);
    if (!result.modifiedCount) {
      return res
        .status(404)
        .json({ error: true, errorMessage: 'User not found' });
    }

    return res.status(200).json({ error: false, message: 'User updated' });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.stoString() });
  }
}

async function posts(req, res) {
  try {
    const userId = req._id;
    const userWithPost = await userService.getUserWithPost(userId);
    return res.status(200).json({ error: false, user: userWithPost });
  } catch (error) {
    return res
      .status(500)
      .json({ error: false, errorMessage: error.toString() });
  }
}

module.exports = {
  signUp,
  login,
  update,
  posts
};
