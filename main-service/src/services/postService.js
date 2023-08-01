const {
  models: { Post }
} = require('../db/models');

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
  return Post.find(options).select('_id content').populate({
    path: 'user',
    select: '_id fullName'
  });
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  findUserPosts
};
