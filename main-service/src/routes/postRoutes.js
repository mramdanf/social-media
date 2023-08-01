const express = require('express');
const { body } = require('express-validator');

const verifyTokenMiddleware = require('../middlewares/verifyToken');

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

module.exports = router;
