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
  return userModel.updateOne({ id }, { ...rest });
}

module.exports = {
  createUser,
  findUserByEmail,
  updateUser
};
