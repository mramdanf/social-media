const userModel = require('../models/user');
const { bcryptHas } = require('../utils/encriptions');

async function createUser(user) {
  const hasdedPassword = await bcryptHas(user.password);
  const userData = {
    ...user,
    password: hasdedPassword
  };
  return userModel.create(userData);
}

function findUserByEmail(email) {
  return userModel.findOne({ email });
}

function updateUser(payload) {
  const { id, ...rest } = payload;
  return userModel.updateOne({ _id: id }, { ...rest });
}

function addPostToUser(userId, postId) {
  return userModel.updateOne({ _id: userId }, { post: postId });
}

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  addPostToUser
};
