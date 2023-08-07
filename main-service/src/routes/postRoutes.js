const express = require('express');
const { body, param } = require('express-validator');

const verifyTokenMiddleware = require('../middlewares/verifyToken');
const checkValidationResultMiddleware = require('../middlewares/checkValidationResult');
const { upload } = require('../middlewares/multerUpload');

const postService = require('../services/postService');

const router = express.Router();

const postController = require('../controllers/postController');

router.post(
  '/',
  verifyTokenMiddleware,
  upload.single('image'),
  body('content').notEmpty(),
  checkValidationResultMiddleware,
  postController.createPost
);
router.put(
  '/',
  verifyTokenMiddleware,
  upload.single('image'),
  body('id')
    .isAlphanumeric()
    .notEmpty()
    .custom(async (value, { req }) => {
      const postExist = await postService.findOneUserPost(value, req._id);
      if (!postExist) {
        throw new Error('Invalid post id.');
      }
    }),
  body('content').notEmpty(),
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
