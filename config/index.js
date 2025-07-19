const dotenv = require('dotenv');

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.PORT || 5000,
    databaseURL: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
      level: process.env.LOG_LEVEL || 'silly',
    },
  },
  production: {
    port: process.env.PORT || 5000,
    databaseURL: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
      level: 'info',
    },
  },
  test: {
    port: process.env.PORT || 5000,
    databaseURL: process.env.MONGO_URI_TEST,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
      level: 'error',
    },
  },
};

module.exports = config[process.env.NODE_ENV];
