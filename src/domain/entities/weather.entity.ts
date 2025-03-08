export class WeatherEntity {
  constructor(
    public cityName: string,
    public country: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public condition: string
  ) {}
}
