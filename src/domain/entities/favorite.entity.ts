export class WeatherSummary {
  constructor(
    public temperature: number,
    public humidity: number,
    public condition: string
  ) {}
}

export class FavoriteEntity {
  constructor(
    public userId: string,
    public city: string,
    public country: string,
    public weather: WeatherSummary // ✅ Separate weather summary object
  ) {}
}
