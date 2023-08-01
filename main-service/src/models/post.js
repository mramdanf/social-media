const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  content: String,
  image: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Post', postSchema);
