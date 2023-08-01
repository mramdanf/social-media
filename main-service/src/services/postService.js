const {
  models: { Post }
} = require('../db/models');

function createPost(post, userId) {
  return Post.create({ ...post, user: userId });
}

function getPostsByUser(userId) {
  return Post.find({ user: userId }).populate('user');
}

function updatePost(payload) {
  const { id, userId, ...rest } = payload;
  return Post.updateOne({ _id: id, user: userId }, { ...rest });
}

function deletePost(payload) {
  const { id, userId } = payload;
  return Post.deleteOne({ _id: id, user: userId });
}

module.exports = {
  createPost,
  getPostsByUser,
  updatePost,
  deletePost
};
