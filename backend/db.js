require('dotenv').config();
const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Not found'); // Debug URI
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb+srv://Archa:6uXIW9FS9GYKJQMF@cluster0.v3io2p7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`Db connection failed`,error.name, error.message);
  }
};

module.exports = connectDB;
