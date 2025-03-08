import { WeatherEntity } from '../../domain/entities/weather.entity';

export interface IWeatherProvider {
  getWeather(
    city?: string,
    country?: string,
    lat?: number,
    lon?: number
  ): Promise<WeatherEntity>;
}
