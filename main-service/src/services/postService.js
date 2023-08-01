const postModel = require('../models/post');

function createPost(post, userId) {
  return postModel.create({ ...post, user: userId });
}

function getPostsByUser(userId) {
  return postModel.find({ user: userId }).populate('user');
}

module.exports = {
  createPost,
  getPostsByUser
};
