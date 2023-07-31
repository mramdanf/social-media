const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/userController');
const emailExistMiddleware = require('../middlewares/emailExist');

router.post(
  '/sign-up',
  body('fullName').notEmpty(),
  body('password').notEmpty(),
  body('email').isEmail().notEmpty(),
  emailExistMiddleware,
  userController.signUp
);

router.post(
  '/login',
  body('password').notEmpty(),
  body('email').isEmail().notEmpty(),
  userController.login
);

module.exports = router;
