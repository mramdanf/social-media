const postModel = require('../models/post');

function createPost(post, userId) {
  return postModel.create({ ...post, user: userId });
}

function getPostsByUser(userId) {
  return postModel.find({ user: userId }).populate('user');
}

function updatePost(payload) {
  const { id, userId, ...rest } = payload;
  return postModel.updateOne({ _id: id, user: userId }, { ...rest });
}

module.exports = {
  createPost,
  getPostsByUser,
  updatePost
};
