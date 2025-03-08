import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../application/services/weather.service';
import { OpenWeatherProvider } from '../infrastructure/providers/weather.provider';
import { RedisCache } from '../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../infrastructure/providers/ip-location.provider';

const weatherProvider = new OpenWeatherProvider();
const cache = new RedisCache();
const ipLocationProvider = new IpLocationProvider();

const weatherService = new WeatherService(
  weatherProvider,
  cache,
  ipLocationProvider
);

export class WeatherController {
  async getWeather(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { city, country, lat, lon } = req.query;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      console.log('yayaya');

      const weather = await weatherService.getWeather(
        city as string,
        country as string,
        lat ? Number(lat) : undefined,
        lon ? Number(lon) : undefined,
        ip as string
      );
      res.status(200).json({ weather });
    } catch (error) {
      next(error); // ✅ Ensures Express handles the error
    }
  }
}
