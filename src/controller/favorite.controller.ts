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

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Manage user favorite cities
 */
export class FavoriteController {
  /**
   * @swagger
   * /favorites:
   *   post:
   *     summary: Add or update a favorite city
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               city:
   *                 type: string
   *                 example: "Paris"
   *               country:
   *                 type: string
   *                 example: "FR"
   *     responses:
   *       201:
   *         description: Favorite added successfully
   */
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
      const { city, country } = req.body;

      await favoriteService.addOrUpdateFavorite(userId, city, country);
      res.status(201).json({ message: 'Favorite added successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /favorites:
   *   get:
   *     summary: Get all favorite cities for the logged-in user
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of favorite cities (encrypted)
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 favorites:
   *                   type: string
   *                   description: Encrypted list of favorite cities
   */
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

  /**
   * @swagger
   * /favorites/{city}/{country}:
   *   delete:
   *     summary: Remove a favorite city
   *     tags: [Favorites]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: city
   *         required: true
   *         schema:
   *           type: string
   *         example: "Paris"
   *         description: City name
   *       - in: path
   *         name: country
   *         required: true
   *         schema:
   *           type: string
   *         example: "FR"
   *         description: Country code (ISO 3166-1)
   *     responses:
   *       200:
   *         description: Favorite removed successfully
   */
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
    } catch (error) {
      next(error);
    }
  }
}
