import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../application/services/auth.service';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { AuthenticatedRequest } from '../types/express';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */
export class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register(username, email, password);
      res.status(201).json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     username:
   *                       type: string
   *                     email:
   *                       type: string
   *                 token:
   *                   type: string
   *                   description: JWT token for authentication
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /auth/profile:
   *   get:
   *     summary: Get the authenticated user's profile
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     username:
   *                       type: string
   *                     email:
   *                       type: string
   *       401:
   *         description: Unauthorized
   */
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

      const userId = req.user.id;
      const user = await authService.getProfile(userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
