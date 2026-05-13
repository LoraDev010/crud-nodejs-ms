import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import productsRoutes from './routes/products.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'products-service' }));

  app.use('/api/products', productsRoutes);

  app.use(errorMiddleware);

  return app;
}
