const postModel = require('../models/post');

function createPost(post, userId) {
  return postModel.create({ ...post, user: userId });
}

module.exports = {
  createPost
};
