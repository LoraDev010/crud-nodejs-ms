import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { sendError } from '../utils/response.util';

type ClassConstructor<T> = new (...args: unknown[]) => T;

export function validateDto<T extends object>(DtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const instance = plainToInstance(DtoClass, req.body);
    const errors = await validate(instance as object, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
      sendError(res, messages.join(', '), 400);
      return;
    }

    req.body = instance;
    next();
  };
}
