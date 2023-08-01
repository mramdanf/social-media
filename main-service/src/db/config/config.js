require('dotenv').config();

const {
  MONGO_DB_NAME,
  MONGO_DB_ROOT_USERNAME,
  MONGO_DB_ROOT_PASSWORD,
  MONGO_DB_PORT,
  MONGO_DB_HOST
} = process.env;

module.exports = {
  development: {
    database: {
      url: `mongodb://${MONGO_DB_ROOT_USERNAME}:${MONGO_DB_ROOT_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?tls=false&authSource=${MONGO_DB_ROOT_USERNAME}`,
      options: {
        useNewUrlParser: true
      }
    }
  },
  test: {
    database: {
      url: 'mongodb://localhost/mongoose_test',
      options: {
        useNewUrlParser: true
      }
    }
  },
  production: {
    database: {
      protocol: 'mongodb',
      username: 'root',
      password: 'password',
      name: 'database_production',
      host: 'localhost',
      port: '',
      options: {
        useNewUrlParser: true
      }
    }
  }
};
