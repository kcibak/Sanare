import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  // This is a placeholder. Keycloak middleware will be added later.
  next();
}
