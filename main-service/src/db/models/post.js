module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema({
    content: String,
    image: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  });
  const Post = mongoose.model('Post', newSchema);
  return Post;
};
