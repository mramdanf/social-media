const _get = require('lodash/get');
const {
  models: { User }
} = require('../db/models');
const { bcryptHas } = require('../utils/encriptions');
const postService = require('./postService');

async function createUser(user) {
  const hasdedPassword = await bcryptHas(user.password);
  const userData = {
    ...user,
    password: hasdedPassword
  };
  return User.create(userData);
}

function findUserByEmail(email) {
  return User.findOne({ email });
}

function updateUser(payload) {
  const { id, ...rest } = payload;
  return User.updateOne({ _id: id }, { ...rest });
}

async function addPostToUser(userId, postId) {
  const user = await User.findById(userId).exec();
  return User.updateOne({ _id: userId }, { posts: [...user.posts, postId] });
}

async function follow(userId, followedUserId) {
  try {
    const user = await User.findById(userId).exec();
    const followedUser = await User.findById(followedUserId).exec();

    if (user.following.includes(followedUserId)) {
      return {
        error: true,
        errorMessage: 'Re-follow same user not allowed.',
        code: 409
      };
    }

    if (!followedUser) {
      return {
        error: true,
        errorMessage: 'No followed user found',
        code: 404
      };
    }

    const updateResult = await User.updateOne(
      { _id: userId },
      { following: [...user.following, followedUserId] }
    );

    if (!updateResult.modifiedCount) {
      return {
        error: true,
        errorMessage: 'No user found.',
        code: 404
      };
    }

    return {
      error: false,
      message: `Successfully followed ${followedUser.fullName}`,
      code: 200
    };
  } catch (error) {
    return {
      error: true,
      errorMessage: error.toString(),
      code: 500
    };
  }
}

async function userFeed(keywords, userId) {
  const regexTemplate = new RegExp(`${keywords}`, 'gm');

  const userOwnPosts = await postService.findUserPosts({
    user: userId,
    ...(keywords ? { content: regexTemplate } : {}) // search by keywords if any
  });

  const allPosts = [...userOwnPosts];

  const userFollowingPosts = await User.findById(userId)
    .select('fullName following')
    .populate({
      path: 'following',
      select: 'fullName posts',
      match: { posts: { $exists: true, $ne: [] } }, // exclude following with empty posts
      populate: {
        path: 'posts',
        select: '_id content',
        ...(keywords ? { match: { content: regexTemplate } } : {}), // search by keywords if any
        populate: {
          path: 'user',
          select: '_id fullName'
        }
      }
    });

  if (_get(userFollowingPosts, 'following')) {
    // flatten post from follwed users
    userFollowingPosts.following.forEach((following) => {
      following.posts.forEach((post) => {
        allPosts.push(post);
      });
    });
  }

  return allPosts;
}

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  addPostToUser,
  follow,
  userFeed
};
