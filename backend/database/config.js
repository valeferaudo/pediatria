const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    // await mongoose.connect(process.env.DB_STRING);
    mongoose.connect('mongodb://localhost:27017/pediatria', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DataBase is connected');
  } catch (error) {
    console.log(error);
    throw new Error('Database connection error');
  }
};

module.exports = { dbConnection };
