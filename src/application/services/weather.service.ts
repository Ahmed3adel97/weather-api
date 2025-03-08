import { IWeatherProvider } from '../interfaces/weather-provider.interface';
import { RedisCache } from '../../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../../infrastructure/providers/ip-location.provider';
import { WeatherDTO } from '../dto/weather.dto';
import { CryptoService } from '../../infrastructure/security/crypto.service';

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
  ): Promise<string> {
    console.log('sisis');
    console.log({ city, country, lat, lon, ip });

    if (!lat || !lon) {
      if (ip) {
        try {
          const location = await this.ipLocationProvider.getLocation(ip);
          console.log(location);

          lat = location.lat;
          lon = location.lon;
        } catch (err) {
          console.log(err);
          throw err;
        }
      } else {
        throw new Error('Location data missing.');
      }
    }
    console.log('kamama');

    const cacheKey = `weather:${lat},${lon}`;
    const cachedWeather = await this.cache.get(cacheKey);

    if (cachedWeather) {
      return CryptoService.encrypt(JSON.parse(cachedWeather));
    }

    const weatherData = await this.weatherProvider.getWeather(
      city,
      country,
      lat,
      lon
    );

    await this.cache.set(cacheKey, JSON.stringify(weatherData));

    return CryptoService.encrypt(WeatherDTO.fromEntity(weatherData));
  }
}
