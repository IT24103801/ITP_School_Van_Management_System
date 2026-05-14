const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri =
  process.env.MONGO_URI ||
  `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.MONGO_PORT || 27017}/${process.env.DB_NAME || 'school_van_system'}`;

async function connectDatabase() {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  return mongoose.connection;
}

module.exports = { connectDatabase, mongoose };
