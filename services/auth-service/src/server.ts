import { createApp } from './app';
import { initDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await initDatabase();
  const app = createApp();
  app.listen(env.AUTH_SERVICE_PORT, () => {
    console.log(`auth-service corriendo en puerto ${env.AUTH_SERVICE_PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar auth-service:', err);
  process.exit(1);
});
