import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { setupSwagger } from './infrastructure/swagger/swagger.config';
import authRoutes from './routes/auth.routes';
import weatherRoutes from './routes/weather.routes';
import favoriteRoutes from './routes/favorite.routes';
import logger from './infrastructure/logger/winston.logger'; // ✅ Logging
import { prometheusMiddleware } from './infrastructure/monitoring/prometheus';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(prometheusMiddleware); // ✅ Enable Prometheus metrics

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.send('🌍 Weather API is running...');
});

app.use((req, res, next) => {
  logger.info(`📢 ${req.method} ${req.url}`);
  next();
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;
