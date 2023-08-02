const {
  models: { Post }
} = require('../db/models');
const {
  endpointErrorResponse,
  endpointSuccessResponse
} = require('../utils/apiResponse');

function createPost(post, userId) {
  return Post.create({ ...post, user: userId });
}

function updatePost(payload) {
  const { id, userId, ...rest } = payload;
  return Post.updateOne({ _id: id, user: userId }, { ...rest });
}

function deletePost(payload) {
  const { id, userId } = payload;
  return Post.deleteOne({ _id: id, user: userId });
}

function findUserPosts(options) {
  return Post.find(options)
    .select('_id content')
    .populate([
      {
        path: 'user',
        select: '_id fullName'
      },
      {
        path: 'comments',
        select: '_id content'
      },
      {
        path: 'likedBy',
        select: '_id fullName'
      }
    ]);
}

async function likeAPost(postId, userId) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return endpointErrorResponse('Post not found', 404);
    }

    if (post.likedBy.includes(userId)) {
      return endpointErrorResponse('This post already liked by you.', 409);
    }

    await Post.updateOne(
      { _id: postId },
      { likedBy: [...post.likedBy, userId] }
    );

    return endpointSuccessResponse({
      message: 'Successfully liked a post.',
      errorMessage: '',
      code: 200
    });
  } catch (error) {
    return endpointErrorResponse(error.toString(), 500);
  }
}

async function addComment(postId, commentId) {
  const post = await Post.findById(postId);
  return Post.updateOne(
    { _id: postId },
    { comments: [...post.comments, commentId] }
  );
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  findUserPosts,
  likeAPost,
  addComment
};
