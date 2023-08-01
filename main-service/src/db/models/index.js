'use strict';

const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.js`)[env];

if (config.database.url) {
  Mongoose.connect(config.database.url, config.database.options);
} else if (config.database.config.dbName) {
  Mongoose.connect(
    `${config.database.protocol}://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}`,
    config.database.options
  );
} else {
  Mongoose.connect(
    `${config.database.protocol}://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`,
    config.database.options
  );
}

const db = () => {
  const m = {};

  fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
    .forEach((file) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const model = require(path.resolve(__dirname, file))(Mongoose);
      m[model.modelName] = model;
    });

  return m;
};

const models = db();
const mongoose = Mongoose;

module.exports = mongoose;
module.exports.default = models;
