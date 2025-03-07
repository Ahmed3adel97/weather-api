import { FavoriteCity, IFavoriteCity } from '../models/favorite.model';

export class FavoriteRepository {
  async addFavorite(
    userId: string,
    cityData: Partial<IFavoriteCity>
  ): Promise<IFavoriteCity> {
    const favorite = new FavoriteCity({ ...cityData, user: userId });
    return await favorite.save();
  }

  async getFavoritesByUser(userId: string): Promise<IFavoriteCity[]> {
    return await FavoriteCity.find({ user: userId });
  }

  async removeFavorite(userId: string, cityId: string): Promise<void> {
    await FavoriteCity.findOneAndDelete({ _id: cityId, user: userId });
  }
}
