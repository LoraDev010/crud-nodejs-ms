import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  USERS_SERVICE_PORT: z.string().default('3002').transform(Number),
  JWT_SECRET: z.string().min(32),
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
