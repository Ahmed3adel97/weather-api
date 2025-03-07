import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string }; // ✅ Add user object with required fields
}
