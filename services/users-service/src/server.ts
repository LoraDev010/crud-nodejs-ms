import { createApp } from './app';
import { initDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await initDatabase();
  const app = createApp();
  app.listen(env.USERS_SERVICE_PORT, () => {
    console.log(`users-service corriendo en puerto ${env.USERS_SERVICE_PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar users-service:', err);
  process.exit(1);
});
