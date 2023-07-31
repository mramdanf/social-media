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

module.exports = {
  createUser
};
