const {
  models: { User }
} = require('../db/models');
const { bcryptHas } = require('../utils/encriptions');

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
  const user = await User.findById(userId);
  return User.updateOne({ _id: userId }, { post: [...user.post, postId] });
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

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  addPostToUser,
  follow
};
