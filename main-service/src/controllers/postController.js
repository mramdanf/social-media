const postService = require('../services/postService');
const userService = require('../services/userService');

async function createPost(req, res) {
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

async function updateUserPost(req, res) {
  try {
    const result = await postService.updatePost({
      userId: req._id,
      ...req.body
    });
    if (!result.modifiedCount) {
      return res
        .status(404)
        .json({ error: true, errorMessage: 'Post not found.' });
    }

    return res.status(200).json({
      error: false,
      message: `Post with id ${req.body.id} successfully updated`
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: false, errorMessage: error.toString() });
  }
}

async function deleteUserPost(req, res) {
  try {
    const userId = req._id;
    const { postId } = req.params;
    const result = await postService.deletePost({ id: postId, userId });

    if (!result.deletedCount) {
      return res.status(404).json({
        error: false,
        message: 'Post not found'
      });
    }

    return res.status(200).json({
      error: false,
      message: `Post with id ${postId} successfully deleted`
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      errorMessage: error.toString()
    });
  }
}

async function like(req, res) {
  const userId = req._id;
  const { postId } = req.body;

  const { error, errorMessage, message, code } = await postService.likeAPost(
    postId,
    userId
  );
  return res.status(code).json({ error, errorMessage, message });
}

module.exports = {
  createPost,
  updateUserPost,
  deleteUserPost,
  like
};
