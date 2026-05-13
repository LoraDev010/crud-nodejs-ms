import { Request, Response, NextFunction } from 'express';
import { sendError } from '@crud-ms/shared';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err.stack);
  sendError(res, err.message ?? 'Error interno del servidor', 500);
}
