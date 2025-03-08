import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '3000',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/weather-api',
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
};
