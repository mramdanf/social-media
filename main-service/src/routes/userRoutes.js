const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/userController');
const emailExistMiddleware = require('../middlewares/emailExist');
const verifyTokenMiddleware = require('../middlewares/verifyToken');
const checkValidationResultMiddleware = require('../middlewares/checkValidationResult');

router.post(
  '/sign-up',
  body('fullName').notEmpty(),
  body('password').notEmpty(),
  body('email').isEmail().notEmpty(),
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
  body('fullName').notEmpty(),
  body('email').isEmail().notEmpty(),
  emailExistMiddleware,
  verifyTokenMiddleware,
  checkValidationResultMiddleware,
  userController.update
);

module.exports = router;
