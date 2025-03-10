import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './infrastructure/database/mongo.connection';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { ENV } from './config/env.config';
import { setupSwagger } from './infrastructure/swagger/swagger.config';
import authRoutes from './routes/auth.routes';
import weatherRoutes from './routes/weather.routes';
import favoriteRoutes from './routes/favorite.routes';

// ✅ Load environment variables
dotenv.config();

// ✅ Create Express App
const app = express();

// ✅ Apply Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.send(' Weather API is running...');
});

if (process.env.NODE_ENV !== 'test') {
  connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;
