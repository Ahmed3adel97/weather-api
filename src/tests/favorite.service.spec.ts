import { FavoriteService } from '../application/services/favorite.service';
import { FavoriteRepository } from '../infrastructure/database/repositories/favorite.repository';
import { WeatherService } from '../application/services/weather.service';
import { OpenWeatherProvider } from '../infrastructure/providers/weather.provider';
import { RedisCache } from '../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../infrastructure/providers/ip-location.provider';
import { WeatherEntity } from '../domain/entities/weather.entity';
import {
  FavoriteEntity,
  WeatherSummary,
} from '../domain/entities/favorite.entity';

jest.mock('../infrastructure/database/repositories/favorite.repository');
jest.mock('../application/services/weather.service');
jest.mock('../infrastructure/providers/weather.provider');
jest.mock('../infrastructure/cache/redis.cache');
jest.mock('../infrastructure/providers/ip-location.provider');

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;
  let mockFavoriteRepository: FavoriteRepository;
  let mockWeatherService: WeatherService;
  let mockWeatherProvider: OpenWeatherProvider;
  let mockCache: RedisCache;
  let mockIpLocationProvider: IpLocationProvider;

  beforeEach(() => {
    mockFavoriteRepository = new FavoriteRepository();
    mockWeatherProvider = new OpenWeatherProvider();
    mockCache = new RedisCache();
    mockIpLocationProvider = new IpLocationProvider();

    mockWeatherService = new WeatherService(
      mockWeatherProvider,
      mockCache,
      mockIpLocationProvider
    );

    favoriteService = new FavoriteService(
      mockFavoriteRepository,
      mockWeatherService
    );
  });

  it('should add or update a favorite', async () => {
    const mockWeatherData: WeatherEntity = new WeatherEntity(
      'Paris',
      'FR',
      22,
      50,
      10,
      'Clear'
    );

    jest
      .spyOn(mockWeatherService, 'getWeather')
      .mockResolvedValue(mockWeatherData);
    jest
      .spyOn(mockFavoriteRepository, 'addOrUpdateFavorite')
      .mockResolvedValue(undefined);

    await favoriteService.addOrUpdateFavorite('userId', 'Paris', 'FR');

    expect(mockFavoriteRepository.addOrUpdateFavorite).toHaveBeenCalled();
  });

  it('should retrieve user favorites', async () => {
    const mockFavoriteEntities: FavoriteEntity[] = [
      new FavoriteEntity(
        'userId',
        'Paris',
        'FR',
        new WeatherSummary(22, 50, 'Clear')
      ),
    ];

    jest
      .spyOn(mockFavoriteRepository, 'getFavorites')
      .mockResolvedValue(mockFavoriteEntities);

    const result = await favoriteService.getFavorites('userId');
    expect(result).toEqual(mockFavoriteEntities);
  });
});
