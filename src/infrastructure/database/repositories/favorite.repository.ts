import mongoose from 'mongoose';
import { IFavoriteRepository } from '../../../application/interfaces/favorite-repository.interface';
import {
  FavoriteEntity,
  WeatherSummary,
} from '../../../domain/entities/favorite.entity';
import { FavoriteModel, IFavoriteDocument } from '../models/favorite.model';

export class FavoriteRepository implements IFavoriteRepository {
  private toEntity(favDoc: IFavoriteDocument): FavoriteEntity {
    return new FavoriteEntity(
      favDoc.userId.toString(),
      favDoc.city,
      favDoc.country,
      new WeatherSummary(
        favDoc.weather.temperature,
        favDoc.weather.humidity,
        favDoc.weather.condition
      )
    );
  }

  async addOrUpdateFavorite(favorite: FavoriteEntity): Promise<void> {
    await FavoriteModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(favorite.userId),
        city: favorite.city,
        country: favorite.country,
      },
      {
        $set: {
          weather: {
            temperature: favorite.weather.temperature,
            humidity: favorite.weather.humidity,
            condition: favorite.weather.condition,
          },
        },
      },
      { upsert: true, new: true }
    );
  }

  async getFavorites(userId: string): Promise<FavoriteEntity[]> {
    const favorites = await FavoriteModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });
    return favorites.map(this.toEntity);
  }
  async removeFavorite(
    userId: string,
    city: string,
    country: string
  ): Promise<void> {
    await FavoriteModel.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
      city,
      country,
    });
  }
}
