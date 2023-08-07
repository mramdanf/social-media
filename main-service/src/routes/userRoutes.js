const express = require('express');
const { body } = require('express-validator');
const _isEmpty = require('lodash/isEmpty');

const router = express.Router();

const userController = require('../controllers/userController');
const emailExistMiddleware = require('../middlewares/emailExist');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const checkValidationResultMiddleware = require('../middlewares/checkValidationResult');

router.post(
  '/sign-up',
  body('fullName').notEmpty().isAlpha(),
  body('email').isEmail().notEmpty(),
  body('password').notEmpty(),
  emailExistMiddleware,
  checkValidationResultMiddleware,
  userController.signUp
);

router.post(
  '/login',
  body('password').notEmpty(),
  body('email').isEmail().notEmpty(),
  checkValidationResultMiddleware,
  userController.login
);

router.put(
  '/update',
  body().custom(async (bodyValue) => {
    if (_isEmpty(bodyValue)) {
      throw new Error('Should update at least one user field');
    }
    return true;
  }),
  verifyTokenMiddleware,
  emailExistMiddleware,
  checkValidationResultMiddleware,
  userController.update
);

router.put(
  '/follow',
  body('followedUserId').notEmpty().isAlphanumeric(),
  verifyTokenMiddleware,
  checkValidationResultMiddleware,
  userController.followOtherUser
);

router.get('/feed', verifyTokenMiddleware, userController.getUserFeed);

module.exports = router;
