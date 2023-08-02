module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema({
    content: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }
  });
  const Comment = mongoose.model('Comment', newSchema);
  return Comment;
};
