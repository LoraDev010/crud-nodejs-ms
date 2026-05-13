import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../../src/app';
import * as authMiddleware from '../../src/middlewares/auth.middleware';

let mongod: MongoMemoryServer;
const app = createApp();

jest.spyOn(authMiddleware, 'authMiddleware').mockImplementation((_req, _res, next) => next());

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]?.deleteMany({});
  }
});

const validProduct = {
  name: 'Teclado Mecánico',
  description: 'Teclado con switches Cherry MX Red',
  price: 150,
  stock: 25,
  category: 'peripherals',
};

describe('POST /api/products', () => {
  it('debe crear producto y retornar 201', async () => {
    const res = await request(app).post('/api/products').send(validProduct);
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Teclado Mecánico');
  });

  it('debe retornar 400 con datos inválidos', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Sin precio' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/products', () => {
  it('debe retornar lista paginada', async () => {
    await request(app).post('/api/products').send(validProduct);
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });
});

describe('GET /health', () => {
  it('debe retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
