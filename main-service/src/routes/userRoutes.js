const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/userController');

router.post(
  '/sign-up',
  body('fullName').notEmpty(),
  body('password').notEmpty(),
  body('email').isEmail().notEmpty(),
  userController.signUp
);

module.exports = router;
