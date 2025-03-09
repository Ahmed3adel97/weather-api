import { Request, Response, NextFunction } from 'express';
import { FavoriteService } from '../application/services/favorite.service';
import { FavoriteRepository } from '../infrastructure/database/repositories/favorite.repository';
import { WeatherService } from '../application/services/weather.service';
import { OpenWeatherProvider } from '../infrastructure/providers/weather.provider';
import { RedisCache } from '../infrastructure/cache/redis.cache';
import { IpLocationProvider } from '../infrastructure/providers/ip-location.provider';
import { AuthenticatedRequest } from '../types/express';
import { CryptoService } from '../infrastructure/encryption/crypto.service';

const favoriteRepository = new FavoriteRepository();
const weatherService = new WeatherService(
  new OpenWeatherProvider(),
  new RedisCache(),
  new IpLocationProvider()
);
const favoriteService = new FavoriteService(favoriteRepository, weatherService);

export class FavoriteController {
  async addFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userId = req.user.id;
      console.log({ userId });

      const { city, country } = req.body;

      await favoriteService.addOrUpdateFavorite(userId, city, country);
      res.status(201).json({ message: 'Favorite added successfully' });
    } catch (error) {
      next(error);
    }
  }
  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const city = '';
      const country = '';
      const userId = req.user.id;
      const user = await favoriteService.addOrUpdateFavorite(
        userId,
        city,
        country
      );
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
  async getFavorites(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const userId = req.user.id;
      const favorites = await favoriteService.getFavorites(userId);
      const encryptedData = CryptoService.encrypt(JSON.stringify(favorites));

      res.status(200).json({ favorites: encryptedData });
    } catch (error) {
      next(error);
    }
  }
  async removeFavorite(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userId = req.user.id;
      const { city, country } = req.params;

      await favoriteService.removeFavorite(userId, city, country);
      res.status(200).json({ message: 'Favorite removed successfully' });
      next();
    } catch (error) {
      next(error);
    }
  }
}
