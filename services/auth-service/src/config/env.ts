import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  AUTH_SERVICE_PORT: z.string().default('3001').transform(Number),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SQLSERVER_HOST: z.string(),
  SQLSERVER_PORT: z.string().default('1433').transform(Number),
  SQLSERVER_DATABASE: z.string(),
  SQLSERVER_USER: z.string(),
  SQLSERVER_PASSWORD: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
