'use strict';

const { faker } = require('@faker-js/faker');

const fakerUsers = [...Array(100)].map(() => ({
  fullName: faker.person.fullName(),
  email: faker.internet.email().toString().toLowerCase(),
  password: '$2a$10$rX.2qi9WgfyRK4Xl.z4J7.Qt901y6yy87Mk2T5gxEKdxG.dnASH7m'
}));
const dummyUsers = [
  ...fakerUsers,
  {
    fullName: 'azfar shidqi',
    email: 'azfar@test.com',
    password: '$2a$10$rX.2qi9WgfyRK4Xl.z4J7.Qt901y6yy87Mk2T5gxEKdxG.dnASH7m'
  },
  {
    fullName: 'lisda adistinai',
    email: 'lisda@test.com',
    password: '$2a$10$lSYtyLd7ZUVcuW2upBWthOEKKavarPLVIOQTm53DOICd1LEGE37j.'
  }
];

module.exports = {
  up: (models) =>
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
    models.User.bulkWrite(
      dummyUsers.map((u) => ({
        insertOne: {
          document: {
            ...u
          }
        }
      }))
    ).then((res) => {
      // Prints "1"
      console.log(res.insertedCount);
    }),
  down: (models) =>
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
    models.User.deleteMany({ fullName: /\w+/ }).then((res) => {
      // Prints "1"
      console.log(res.deletedCount);
    })
};
