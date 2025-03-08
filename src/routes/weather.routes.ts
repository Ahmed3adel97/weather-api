import express from 'express';
import { WeatherController } from '../controller/weather.controller';
import { asyncHandler } from '../infrastructure/security/auth.middleware';
const router = express.Router();
const weatherController = new WeatherController();

router.get(
  '/',
  asyncHandler(weatherController.getWeather.bind(weatherController))
);

export default router;
