const mongoose = require('mongoose');

exports.connectDB = async () => {
  try {
    const DB = process.env.MONGO_URI;

    // For Mongoose 6 and above, the connection options are no longer necessary
    // as they are included by default.
    await mongoose.connect(DB);
    console.log('MongoDB connection successful!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

exports.disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
    process.exit(1);
  }
};