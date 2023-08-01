const {
  models: { User }
} = require('../db/models');
const { bcryptHas } = require('../utils/encriptions');

async function createUser(user) {
  const hasdedPassword = await bcryptHas(user.password);
  const userData = {
    ...user,
    password: hasdedPassword
  };
  return User.create(userData);
}

function findUserByEmail(email) {
  return User.findOne({ email });
}

function updateUser(payload) {
  const { id, ...rest } = payload;
  return User.updateOne({ _id: id }, { ...rest });
}

function addPostToUser(userId, postId) {
  return User.updateOne({ _id: userId }, { post: postId });
}

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  addPostToUser
};
