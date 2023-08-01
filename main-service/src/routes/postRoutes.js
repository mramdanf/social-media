const express = require('express');
const { body, param } = require('express-validator');

const verifyTokenMiddleware = require('../middlewares/verifyToken');
const checkValidationResultMiddleware = require('../middlewares/checkValidationResult');

const router = express.Router();

const postController = require('../controllers/postController');

router.post(
  '/',
  body('content').notEmpty(),
  verifyTokenMiddleware,
  postController.createPost
);
router.put(
  '/',
  body('content').notEmpty(),
  body('id').isAlphanumeric().notEmpty(),
  verifyTokenMiddleware,
  postController.updateUserPost
);
router.get('/', verifyTokenMiddleware, postController.postsByUser);
router.delete(
  '/:postId',
  param('postId').isAlphanumeric().notEmpty(),
  checkValidationResultMiddleware,
  verifyTokenMiddleware,
  postController.deleteUserPost
);

module.exports = router;
