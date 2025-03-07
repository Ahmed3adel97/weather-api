import express from 'express';
import { AuthController } from '../controller/auth.controller';
import {
  authMiddleware,
  asyncHandler,
} from '../infrastructure/security/auth.middleware';

const router = express.Router();
const authController = new AuthController();

router.post(
  '/register',
  asyncHandler(authController.register.bind(authController))
);
router.post('/login', asyncHandler(authController.login.bind(authController)));
router.get(
  '/profile',
  authMiddleware,
  asyncHandler(authController.getProfile.bind(authController))
);

export default router;
