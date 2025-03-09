import axios from 'axios';
import { IWeatherProvider } from '../../application/interfaces/weather-provider.interface';
import { WeatherEntity } from '../../domain/entities/weather.entity';
import { ENV } from '../../config/env.config';

export class OpenWeatherProvider implements IWeatherProvider {
  private API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // ✅ Ensure this method is explicitly marked as "public"
  public async getWeather(
    city?: string,
    country?: string,
    lat?: number,
    lon?: number
  ): Promise<WeatherEntity> {
    if (!ENV.WEATHER_API_KEY) {
      throw new Error('❌ Missing WEATHER_API_KEY in environment variables.');
    }

    const params: any = {
      appid: ENV.WEATHER_API_KEY,
      units: 'metric',
    };

    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else if (city && country) {
      params.q = `${city},${country}`;
    } else {
      throw new Error(
        'Either city/country or latitude/longitude must be provided.'
      );
    }

    try {
      const response = await axios.get(this.API_URL, { params });
      const data = response.data;

      return new WeatherEntity(
        data.name,
        data.sys.country,
        data.main.temp,
        data.main.humidity,
        data.wind.speed,
        data.weather[0].description
      );
    } catch (error: any) {
      console.error(
        '❌ OpenWeather API Error:',
        error.response?.data || error.message
      );
      throw new Error('Failed to fetch weather data.');
    }
  }
}
