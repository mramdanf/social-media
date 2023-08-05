'use strict';

module.exports = {
  up: async (models) => {
    const azfar = await models.User.findOne({ email: 'azfar@test.com' }).exec();
    const lisda = await models.User.findOne({ email: 'lisda@test.com' }).exec();
    const lisdaPosts = await models.Post.find({ user: lisda._id });
    const lisdaFirstPost = lisdaPosts[0];

    const newComment = await models.Comment.create({
      content: 'azfar commented on lisda post',
      author: azfar._id,
      post: lisdaFirstPost._id
    });

    await models.Post.updateOne(
      { _id: lisdaFirstPost._id },
      { comments: [newComment._id] }
    );

    return models.Comment.find()
      .exec()
      .then((res) => console.log('comment created: ', res.length));
  },

  down: (models) =>
    models.Comment.deleteMany({ content: /\w/ }).then((res) =>
      console.log('comment deleted: ', res.deletedCount)
    )
};
