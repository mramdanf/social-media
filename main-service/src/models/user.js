const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: String,
  email: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
