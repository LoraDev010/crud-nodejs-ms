import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalTeardown(): Promise<void> {
  const mongod = (globalThis as Record<string, unknown>).__MONGOD__ as MongoMemoryServer;
  if (mongod) await mongod.stop();
}
