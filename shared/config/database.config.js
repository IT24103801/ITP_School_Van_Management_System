// Shared MongoDB configuration

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/school_van_system',
  DB_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};
