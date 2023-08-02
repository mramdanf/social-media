const {
  models: { Comment }
} = require('../db/models');

function createComment({ content, userId, postId }) {
  return Comment.create({ content, author: userId, post: postId });
}

module.exports = {
  createComment
};
