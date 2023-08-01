module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }
  });
  const Ramdan = mongoose.model('User', newSchema);
  return Ramdan;
};
