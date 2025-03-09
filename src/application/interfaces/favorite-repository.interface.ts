import { FavoriteEntity } from '../../domain/entities/favorite.entity';

export interface IFavoriteRepository {
  addOrUpdateFavorite(favorite: FavoriteEntity): Promise<void>;
  getFavorites(userId: string): Promise<FavoriteEntity[]>;
  removeFavorite(userId: string, city: string, country: string): Promise<void>;
}
