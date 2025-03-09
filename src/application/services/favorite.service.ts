import { IFavoriteRepository } from '../interfaces/favorite-repository.interface';
import {
  FavoriteEntity,
  WeatherSummary,
} from '../../domain/entities/favorite.entity';
import { WeatherService } from './weather.service';
import { WeatherEntity } from '../../domain/entities/weather.entity';

export class FavoriteService {
  constructor(
    private favoriteRepository: IFavoriteRepository,
    private weatherService: WeatherService
  ) {}

  async addOrUpdateFavorite(
    userId: string,
    city: string,
    country: string
  ): Promise<void> {
    const weatherData = await this.weatherService.getWeather(city, country);

    const favorite = new FavoriteEntity(
      userId,
      city,
      country,
      new WeatherSummary(
        weatherData.temperature,
        weatherData.humidity,
        weatherData.condition
      )
    );

    await this.favoriteRepository.addOrUpdateFavorite(favorite);
  }

  async getFavorites(userId: string): Promise<WeatherEntity[]> {
    const favorites = await this.favoriteRepository.getFavorites(userId);
    console.log('fffffffff');

    const favoriteWeather = await Promise.all(
      favorites.map(async (fav) => {
        return await this.weatherService.getWeather(fav.city, fav.country);
      })
    );
    console.log({ favoriteWeather });

    // return CryptoService.encrypt(JSON.stringify(favoriteWeather));
    return favoriteWeather;
  }

  async removeFavorite(
    userId: string,
    city: string,
    country: string
  ): Promise<void> {
    await this.favoriteRepository.removeFavorite(userId, city, country);
  }
}
