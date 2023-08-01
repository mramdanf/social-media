'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (models) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          insertOne: {
            document: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    */
    const users = await models.User.find().exec();
    const posts = users.map((user) => ({
      content: faker.lorem.sentence(5),
      user: user._id
    }));
    posts.forEach(async (post) => {
      try {
        const insertedPost = await models.Post.create(post);
        await models.User.updateOne(
          { _id: post.user },
          { posts: [insertedPost._id] }
        );
      } catch (error) {
        console.log(error.toString());
      }
    });
    return models.User.find();
  },

  down: async (models) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
    models.Post.deleteMany({ content: /\w+/ }).then((res) => {
      console.log('deleted posts: ', res.deletedCount);
    })
};
