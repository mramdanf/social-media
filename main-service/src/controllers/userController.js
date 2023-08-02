const jwt = require('jsonwebtoken');
const _get = require('lodash/get');
const userService = require('../services/userService');
const { bcryptCompare } = require('../utils/encriptions');
const {
  endpointSuccessResponse,
  endpointErrorResponse
} = require('../utils/apiResponse');
require('dotenv').config();

async function signUp(req, res) {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(200).json(
      endpointSuccessResponse({
        message: 'Signup successfull!',
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      })
    );
  } catch (error) {
    res.status(500).json(endpointErrorResponse(error.toString()));
  }
}

async function login(req, res) {
  try {
    const userPayload = req.body;
    const user = await userService.findUserByEmail(userPayload.email);

    if (!user) {
      res.status(401).json(endpointErrorResponse('Invalid credential'));
      return;
    }

    const validPassword = await bcryptCompare(
      userPayload.password,
      user.password
    );

    if (!validPassword) {
      res.status(401).json(endpointErrorResponse('Invalid credential'));
      return;
    }

    const token = jwt.sign(
      { _id: user._id },
      `${process.env.MAIN_SERVICE_JWT_PRIVATE_KEY}`,
      { expiresIn: '1h' }
    );

    res.status(200).json(
      endpointSuccessResponse({
        message: 'login success!',
        user: {
          _id: user._id,
          fullName: user.fullName,
          token
        }
      })
    );
  } catch (error) {
    res.status(500).json(endpointErrorResponse(error.toString()));
  }
}

async function update(req, res) {
  try {
    const { _id, ...restPayload } = req.body;
    await userService.updateUser({
      _id: req._id,
      ...restPayload
    });

    return res
      .status(200)
      .json(endpointSuccessResponse({ message: 'User updated' }));
  } catch (error) {
    return res.status(500).json(endpointErrorResponse(error.toString()));
  }
}

async function followOtherUser(req, res) {
  const userId = req._id;
  const { followedUserId } = req.body;
  const { code, ...rest } = await userService.follow(userId, followedUserId);
  return res.status(code).json({ ...rest });
}

async function getUserFeed(req, res) {
  try {
    const keywords = _get(req, 'query.keywords');
    const userId = req._id;
    const posts = await userService.userFeed(keywords, userId);
    return res.status(200).json({ error: false, posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, errorMessage: error.toString() });
  }
}

module.exports = {
  signUp,
  login,
  update,
  followOtherUser,
  getUserFeed
};
