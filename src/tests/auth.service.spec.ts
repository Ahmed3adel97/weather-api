import { WeatherService } from '../application/services/weather.service';
import { OpenWeatherProvider } from '../infrastructure/providers/weather.provider';
import { RedisCache } from '../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../infrastructure/providers/ip-location.provider';
import { WeatherEntity } from '../domain/entities/weather.entity';

jest.mock('../infrastructure/providers/weather.provider');
jest.mock('../infrastructure/cache/redis.cache');
jest.mock('../infrastructure/providers/ip-location.provider');

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let mockWeatherProvider: OpenWeatherProvider;
  let mockCache: RedisCache;
  let mockIpLocationProvider: IpLocationProvider;

  beforeEach(() => {
    mockWeatherProvider = new OpenWeatherProvider();
    mockCache = new RedisCache();
    mockIpLocationProvider = new IpLocationProvider();
    weatherService = new WeatherService(
      mockWeatherProvider,
      mockCache,
      mockIpLocationProvider
    );
  });

  it('should return weather data from cache if available', async () => {
    const mockWeatherData: WeatherEntity = new WeatherEntity(
      'Paris',
      'FR',
      25,
      60,
      10,
      'Clear'
    );

    jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue(JSON.stringify(mockWeatherData));

    const result = await weatherService.getWeather('Paris', 'FR');
    expect(result).toEqual(mockWeatherData);
  });

  it('should fetch weather data if not in cache', async () => {
    const mockWeatherData: WeatherEntity = new WeatherEntity(
      'Paris',
      'FR',
      20,
      50,
      5,
      'Cloudy'
    );

    jest.spyOn(mockCache, 'get').mockResolvedValue(null);
    jest
      .spyOn(mockWeatherProvider, 'getWeather')
      .mockResolvedValue(mockWeatherData);
    jest.spyOn(mockCache, 'set').mockResolvedValue();

    const result = await weatherService.getWeather('Paris', 'FR');
    expect(result).toEqual(mockWeatherData);
  });
});
