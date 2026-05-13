import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, sendError } from '@crud-ms/shared';
import { env } from '../config/env';

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
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET) as JwtPayload;
    next();
  } catch {
    sendError(res, 'Token inválido o expirado', 401);
  }
}
