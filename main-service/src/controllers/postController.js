const _get = require('lodash/get');
const postService = require('../services/postService');
const userService = require('../services/userService');
const commentService = require('../services/commentService');
const s3Service = require('../services/S3Service');
const {
  endpointResponse,
  endpointErrorResponse,
  endpointSuccessResponse
} = require('../utils/apiResponse');

async function createPost(req, res) {
  try {
    const userId = req._id;
    const postImage = _get(req, 'file.filename');

    if (postImage) {
      await s3Service.savePostImageOnS3(postImage);
    }

    const post = {
      ...req.body,
      image: postImage ? s3Service.getPostImageUrl(postImage) : undefined
    };
    const newPost = await postService.createPost(post, userId);
    await userService.addPostToUser(userId, newPost._id);

    return res
      .status(200)
      .json(endpointSuccessResponse({ message: 'Post created.' }));
  } catch (error) {
    return res.status(500).json(endpointErrorResponse(error.toString()));
  }
}

async function updateUserPost(req, res) {
  try {
    const { id, ...rest } = req.body;
    const userId = req._id;

    // if user update the image will delete the old one
    const newImage = _get(req, 'file.location');
    const oldPost = await postService.findOneUserPost(id, userId);

    if (!oldPost) {
      return res.status(404).json(endpointErrorResponse('Post not found', 404));
    }

    if (newImage && oldPost.image) {
      await s3Service.deletePostImageOnS3(oldPost.image);
    }

    await postService.updatePost(id, {
      ...rest,
      user: userId,
      image: newImage
    });

    return res.status(200).json(
      endpointSuccessResponse({
        message: `Post with id ${req.body.id} successfully updated`
      })
    );
  } catch (error) {
    return res.status(500).json(endpointErrorResponse(error.toString()));
  }
}

async function deleteUserPost(req, res) {
  try {
    const userId = req._id;
    const { postId } = req.params;

    const post = await postService.findPostById(postId);

    if (!post) {
      return res.status(404).json(endpointErrorResponse('Post not found', 404));
    }

    if (post.image) {
      await s3Service.deletePostImageOnS3(post.image);
    }

    await postService.deletePost({ id: postId, userId });

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
