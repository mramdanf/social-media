'use strict';

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
    models.User.bulkWrite([
      {
        insertOne: {
          document: {
            fullName: 'azfar shidqi',
            email: 'azfar@test.com',
            password:
              '$2a$10$rX.2qi9WgfyRK4Xl.z4J7.Qt901y6yy87Mk2T5gxEKdxG.dnASH7m' // secret
          }
        }
      },
      {
        insertOne: {
          document: {
            fullName: 'lisda adistinai',
            email: 'lisda@test.com',
            password:
              '$2a$10$lSYtyLd7ZUVcuW2upBWthOEKKavarPLVIOQTm53DOICd1LEGE37j.' // lisda
          }
        }
      }
    ]).then((res) => {
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
    models.User.bulkWrite([
      {
        deleteOne: {
          filter: {
            email: 'azfar@test.com'
          }
        }
      },
      {
        deleteOne: {
          filter: {
            email: 'lisda@test.com'
          }
        }
      }
    ]).then((res) => {
      // Prints "1"
      console.log(res.deletedCount);
    })
};
