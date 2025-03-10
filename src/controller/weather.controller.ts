import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../application/services/weather.service';
import { OpenWeatherProvider } from '../infrastructure/providers/weather.provider';
import { RedisCache } from '../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../infrastructure/providers/ip-location.provider';

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Retrieve weather information
 */
const weatherProvider = new OpenWeatherProvider();
const cache = new RedisCache();
const ipLocationProvider = new IpLocationProvider();

const weatherService = new WeatherService(
  weatherProvider,
  cache,
  ipLocationProvider
);

export class WeatherController {
  /**
   * @swagger
   * /weather:
   *   get:
   *     summary: Get current weather data
   *     tags: [Weather]
   *     parameters:
   *       - in: query
   *         name: city
   *         schema:
   *           type: string
   *         required: false
   *         description: City name
   *       - in: query
   *         name: country
   *         schema:
   *           type: string
   *         required: false
   *         description: Country code (ISO 3166-1)
   *       - in: query
   *         name: lat
   *         schema:
   *           type: number
   *         required: false
   *         description: Latitude
   *       - in: query
   *         name: lon
   *         schema:
   *           type: number
   *         required: false
   *         description: Longitude
   *     responses:
   *       200:
   *         description: Weather data (encrypted)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 encrypted:
   *                   type: string
   */
  async getWeather(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { city, country, lat, lon } = req.query;
      const ip = req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
        : req.socket.remoteAddress;

      const weather = await weatherService.getWeather(
        city as string,
        country as string,
        lat ? Number(lat) : undefined,
        lon ? Number(lon) : undefined,
        ip as string
      );
      res.status(200).json({ weather });
    } catch (error) {
      next(error);
    }
  }
}
