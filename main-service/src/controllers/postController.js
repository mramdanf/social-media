const { validationResult } = require('express-validator');
const postService = require('../services/postService');
const userService = require('../services/userService');

async function createPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ error: true, errorMessage: JSON.stringify(errors.array()) });
  }
  try {
    const userId = req._id;
    const post = req.body;
    const newPost = await postService.createPost(post, userId);
    await userService.addPostToUser(userId, newPost._id);
    return res
      .status(200)
      .json({ error: false, message: 'Post created.', post: newPost });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, errorMessage: error.toString() });
  }
}

async function postsByUser(req, res) {
  try {
    const userId = req._id;
    const posts = await postService.getPostsByUser(userId);
    return res.status(200).json({ error: false, posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: false, errorMessage: error.toString() });
  }
}

module.exports = {
  createPost,
  postsByUser
};
