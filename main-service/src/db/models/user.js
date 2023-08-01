module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
      }
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  });
  const User = mongoose.model('User', newSchema);
  return User;
};
