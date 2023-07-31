const bcrypt = require('bcrypt');

function bcryptHas(plainText) {
  return bcrypt.hash(plainText, 10);
}

module.exports = {
  bcryptHas
};
