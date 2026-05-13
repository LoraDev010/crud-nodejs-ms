import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp(): express.Application {
  const app = express();

  // Middlewares globales — ORDEN IMPORTANTE
  app.use(helmet());          // cabeceras de seguridad HTTP
  app.use(cors());            // habilitar CORS
  app.use(express.json());    // parsear body JSON

  // Health check — sin autenticación
  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'auth-service' }));

  // Rutas del servicio
  app.use('/api/auth', authRoutes);

  // Error handler — SIEMPRE al final, 4 parámetros obligatorios
  app.use(errorMiddleware);

  return app;
}
