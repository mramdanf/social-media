const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: String,
  email: String,
  password: String,
  post: {
    type: Schema.ObjectId,
    ref: 'Post'
  }
});

module.exports = mongoose.model('User', userSchema);
