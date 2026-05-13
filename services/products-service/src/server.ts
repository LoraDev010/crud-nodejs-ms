import { createApp } from './app';
import { connectMongo } from './config/database.mongo';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await connectMongo();
  const app = createApp();
  app.listen(env.PRODUCTS_SERVICE_PORT, () => {
    console.log(`products-service corriendo en puerto ${env.PRODUCTS_SERVICE_PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar products-service:', err);
  process.exit(1);
});
