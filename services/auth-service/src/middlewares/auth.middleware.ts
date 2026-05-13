import { Request, Response, NextFunction } from 'express';
import { JwtPayload, sendError } from '@crud-ms/shared';
import { verifyAccessToken } from '../utils/jwt.util';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    sendError(res, 'Token requerido', 401);
    return;
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    sendError(res, 'Token inválido o expirado', 401);
  }
}
