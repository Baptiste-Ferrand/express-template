import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.util';
import { HttpCode } from '../http_code';

export function verifyToken() {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(HttpCode.UNAUTHORIZED).json({ message: 'Token manquant' });
    }

    const token = auth.slice(7);
    try {
      const payload = verifyJwt<{ profil_id: string; email: string }>(token);
      (req as any).user = payload;
      next();
    } catch {
      return res.status(HttpCode.UNAUTHORIZED).json({ message: 'Token invalide' });
    }
  };
}
