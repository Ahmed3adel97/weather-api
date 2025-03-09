import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './infrastructure/database/mongo.connection';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { ENV } from './config/env.config';
import authRoutes from './routes/auth.routes';
import weatherRoutes from './routes/weather.routes';
import favouriteRoutes from './routes/favorite.routes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favouriteRoutes);

app.get('/', (req, res) => {
  res.send('Weather API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
