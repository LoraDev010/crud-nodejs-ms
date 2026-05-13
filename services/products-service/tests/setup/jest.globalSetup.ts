import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup(): Promise<void> {
  const mongod = await MongoMemoryServer.create();
  process.env['MONGO_URI_TEST'] = mongod.getUri();
  // Guardamos referencia para teardown
  (globalThis as Record<string, unknown>).__MONGOD__ = mongod;
}
