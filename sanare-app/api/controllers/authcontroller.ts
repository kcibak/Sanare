import { Request, Response } from 'express';
import { authenticateProvider } from '../services/authservice';

export const AuthController = {
  /**
   * POST /api/v1/auth/login
   * Authenticates a provider with providerid and password
   */
  async login(req: Request, res: Response) {
    const { providerid, password } = req.body;
    if (!providerid || !password) {
      return res.status(400).json({ error: 'providerid and password are required' });
    }
    const provider = await authenticateProvider(providerid, password);
    if (!provider) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.json({ provider });
  },
};
