const _get = require('lodash/get');
const {
  models: { User }
} = require('../db/models');
const { bcryptHas } = require('../utils/encriptions');
const postService = require('./postService');
const {
  endpointErrorResponse,
  endpointSuccessResponse
} = require('../utils/apiResponse');

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

async function updateUser(payload) {
  const { _id, ...rest } = payload;
  const password = _get(rest, 'password');
  let hasdedPassword;
  if (password) {
    hasdedPassword = await bcryptHas(password);
  }
  const userData = {
    ...rest,
    ...(password && { password: hasdedPassword })
  };
  return User.updateOne({ _id }, userData);
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
      return endpointErrorResponse('Re-follow same user not allowed.', 409);
    }

    if (!followedUser) {
      return endpointErrorResponse('No followed user found', 404);
    }

    const updateResult = await User.updateOne(
      { _id: userId },
      { following: [...user.following, followedUserId] }
    );

    if (!updateResult.modifiedCount) {
      return endpointErrorResponse('No user found.', 404);
    }

    return endpointSuccessResponse({
      message: `Successfully followed ${followedUser.fullName}`,
      code: 200
    });
  } catch (error) {
    return endpointErrorResponse(error.toString(), 500);
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
      // firstly populate following (user)
      path: 'following',

      select: 'fullName posts',
      match: { posts: { $exists: true, $ne: [] } }, // exclude following with empty posts

      // inside following (user)
      populate: {
        // populate following user posts
        path: 'posts',
        select: '_id content',
        ...(keywords ? { match: { content: regexTemplate } } : {}), // search by keywords if any

        // inside user posts
        populate: [
          // populate user on the post
          {
            path: 'user',
            select: '_id fullName'
          },
          // populate comments on the post
          {
            path: 'comments',
            select: '_id content',
            // inside comment populate comment's author
            populate: { path: 'author', select: '_id fullName' }
          },
          // populate likedBy on the post
          {
            path: 'likedBy',
            select: '_id fullName'
          }
        ]
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
