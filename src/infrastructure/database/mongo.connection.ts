import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.mongo_url;

console.log(MONGO_URI);

const port = process.env.port;
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongo_url as string, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
