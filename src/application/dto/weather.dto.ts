import { WeatherEntity } from '../../domain/entities/weather.entity';

export class WeatherDTO {
  constructor(
    public cityName: string,
    public country: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public condition: string
  ) {}

  static fromEntity(weather: WeatherEntity): WeatherDTO {
    return new WeatherDTO(
      weather.cityName,
      weather.country,
      weather.temperature,
      weather.humidity,
      weather.windSpeed,
      weather.condition
    );
  }
}
