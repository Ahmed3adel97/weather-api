import { IWeatherProvider } from '../interfaces/weather-provider.interface';
import { RedisCache } from '../../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../../infrastructure/providers/ip-location.provider';
import { WeatherDTO } from '../dto/weather.dto';
import { WeatherEntity } from '../../domain/entities/weather.entity';

export class WeatherService {
  constructor(
    private weatherProvider: IWeatherProvider, // ✅ Ensures DI is working
    private cache: RedisCache,
    private ipLocationProvider: IpLocationProvider
  ) {}

  async getWeather(
    city?: string,
    country?: string,
    lat?: number,
    lon?: number,
    ip?: string
  ): Promise<WeatherEntity> {
    console.log({ city, ip });

    if (!lat || !lon) {
      if (ip) {
        try {
          const location = await this.ipLocationProvider.getLocation(ip);
          lat = location.lat;
          lon = location.lon;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }

      if (!lat || !lon) {
        if (!city || !country) {
          throw new Error(
            'Location data missing. Provide lat/lon, city/country, or IP.'
          );
        }
      }
    }
    const cacheKey =
      city && country
        ? `weather:${city.toLowerCase()},${country.toUpperCase()}`
        : `weather:${lat},${lon}`;
    const cachedWeather = await this.cache.get(cacheKey);

    if (cachedWeather) {
      // return CryptoService.encrypt(JSON.parse(cachedWeather));
      return JSON.parse(cachedWeather);
    }

    const weatherData = await this.weatherProvider.getWeather(
      city,
      country,
      lat,
      lon
    );

    // await this.cache.set(cacheKey, JSON.stringify(weatherData));

    // return CryptoService.encrypt(WeatherDTO.fromEntity(weatherData));
    return weatherData;
  }
}
