const {
  models: { Post, User }
} = require('../db/models');

function createPost(post, userId) {
  return Post.create({ ...post, user: userId });
}

function getPostsByUser(userId) {
  const keywords = new RegExp(`${'post'}`, 'gm');
  return Post.find({ user: userId, content: keywords }).populate({
    path: 'user',
    populate: {
      path: 'following',
      populate: {
        path: 'post',
        match: { content: keywords }
      }
    }
  });
}

function updatePost(payload) {
  const { id, userId, ...rest } = payload;
  return Post.updateOne({ _id: id, user: userId }, { ...rest });
}

function deletePost(payload) {
  const { id, userId } = payload;
  return Post.deleteOne({ _id: id, user: userId });
}

async function searchUserPosts(keywords, userId) {
  const regexTemplate = new RegExp(`${keywords}`, 'gm');
  const userOwnPosts = await Post.find({
    user: userId,
    content: regexTemplate
  }).populate({
    path: 'user',
    select: '_id fullName'
  });

  const allPosts = [...userOwnPosts];

  const userFollowingPosts = await User.findById(userId)
    .select('fullName following')
    .populate({
      path: 'following',
      select: 'fullName post',
      match: { post: { $exists: true, $ne: [] } },
      populate: {
        path: 'post',
        select: '_id content',
        match: { content: regexTemplate },
        populate: {
          path: 'user',
          select: '_id fullName'
        }
      }
    });
  userFollowingPosts.following.forEach((following) => {
    following.post.forEach((post) => {
      allPosts.push(post);
    });
  });

  return allPosts;
}

module.exports = {
  createPost,
  getPostsByUser,
  updatePost,
  deletePost,
  searchUserPosts
};
