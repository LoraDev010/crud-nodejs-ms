import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import usersRoutes from './routes/users.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'users-service' }));

  app.use('/api/users', usersRoutes);

  app.use(errorMiddleware);

  return app;
}
