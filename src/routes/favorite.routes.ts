import express from 'express';
import { FavoriteController } from '../controller/favorite.controller';
import {
  authMiddleware,
  asyncHandler,
} from '../infrastructure/security/auth.middleware';
const router = express.Router();
const favoriteController = new FavoriteController();
router.post(
  '/',
  authMiddleware,
  asyncHandler(favoriteController.addFavorite.bind(favoriteController))
);
router.get(
  '/',
  authMiddleware,
  asyncHandler(favoriteController.getFavorites.bind(favoriteController))
);
router.delete(
  '/',
  authMiddleware,
  asyncHandler(favoriteController.removeFavorite.bind(favoriteController))
);
export default router;
