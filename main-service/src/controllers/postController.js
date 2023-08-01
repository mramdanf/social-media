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

async function searchUserPosts(req, res) {
  try {
    const userId = req._id;
    const { keywords } = req.query;
    const posts = await postService.searchUserPosts(keywords, userId);
    return res.status(200).json({ error: false, posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, errorMessage: error.toString() });
  }
}

module.exports = {
  createPost,
  postsByUser,
  updateUserPost,
  deleteUserPost,
  searchUserPosts
};
