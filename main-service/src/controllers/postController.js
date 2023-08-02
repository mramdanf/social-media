const postService = require('../services/postService');
const userService = require('../services/userService');
const commentService = require('../services/commentService');
const {
  endpointResponse,
  endpointErrorResponse,
  endpointSuccessResponse
} = require('../utils/apiResponse');

async function createPost(req, res) {
  try {
    const userId = req._id;
    const post = req.body;
    const newPost = await postService.createPost(post, userId);
    await userService.addPostToUser(userId, newPost._id);
    return res.status(200).json({ error: false, message: 'Post created.' });
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
      return res.status(404).json(endpointErrorResponse('Post not found', 404));
    }

    return res.status(200).json(
      endpointSuccessResponse({
        message: `Post with id ${postId} successfully deleted`
      })
    );
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

async function addCommentToPost(req, res) {
  const { content, postId } = req.body;
  const userId = req._id;

  try {
    const comment = await commentService.createComment({
      content,
      userId,
      postId
    });

    if (!comment._id) {
      return res.status(500).json(
        endpointResponse({
          error: true,
          errorMessage: 'Failed to create a comment'
        })
      );
    }

    const commentId = comment._id;
    const result = await postService.addComment(postId, commentId);

    if (!result.modifiedCount) {
      return res.status(500).json(
        endpointResponse({
          error: true,
          errorMessage: 'Failed to update post comment'
        })
      );
    }

    return res
      .status(200)
      .json(endpointResponse({ error: false, message: 'Comment added.' }));
  } catch (error) {
    return res.status(500).json(
      endpointResponse({
        error: true,
        errorMessage: error.toString()
      })
    );
  }
}

module.exports = {
  createPost,
  updateUserPost,
  deleteUserPost,
  addCommentToPost,
  like
};
