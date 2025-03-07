import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../application/services/auth.service';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { AuthenticatedRequest } from '../types/express';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
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
      next(error); // ✅ Pass the error to Express error handler
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ user: result.user, token: result.token });
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

      const userId = req.user.id;
      const user = await authService.getProfile(userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
