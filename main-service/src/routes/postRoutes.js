const express = require('express');
const { body, param } = require('express-validator');

const verifyTokenMiddleware = require('../middlewares/verifyToken');
const checkValidationResultMiddleware = require('../middlewares/checkValidationResult');
const uploadMiddleware = require('../middlewares/multerUpload');

const router = express.Router();

const postController = require('../controllers/postController');

router.post(
  '/',
  uploadMiddleware.single('image'),
  body('content').notEmpty(),
  verifyTokenMiddleware,
  checkValidationResultMiddleware,
  postController.createPost
);
router.put(
  '/',
  body('content').notEmpty(),
  body('id').isAlphanumeric().notEmpty(),
  verifyTokenMiddleware,
  checkValidationResultMiddleware,
  postController.updateUserPost
);
router.delete(
  '/:postId',
  param('postId').isAlphanumeric().notEmpty(),
  verifyTokenMiddleware,
  checkValidationResultMiddleware,
  postController.deleteUserPost
);
router.put(
  '/like',
  body('postId').notEmpty(),
  checkValidationResultMiddleware,
  verifyTokenMiddleware,
  postController.like
);
router.post(
  '/comment',
  body('content').notEmpty(),
  body('postId').notEmpty(),
  verifyTokenMiddleware,
  checkValidationResultMiddleware,
  postController.addCommentToPost
);

module.exports = router;
