import request from 'supertest';
import { createApp } from '../../src/app';
import * as usersService from '../../src/services/users.service';
import * as authMiddleware from '../../src/middlewares/auth.middleware';

jest.mock('../../src/services/users.service');
jest.mock('../../src/config/database', () => ({
  AppDataSource: { getRepository: jest.fn(), initialize: jest.fn() },
  initDatabase: jest.fn(),
}));
// Bypass auth en tests de integración
jest.spyOn(authMiddleware, 'authMiddleware').mockImplementation((_req, _res, next) => next());

const app = createApp();

describe('GET /api/users', () => {
  it('debe retornar lista paginada', async () => {
    const fakeUsers = [{ id: '1', email: 'a@a.com' }];
    (usersService.getAllUsers as jest.Mock).mockResolvedValue([fakeUsers, 1]);

    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('POST /api/users', () => {
  it('debe crear usuario y retornar 201', async () => {
    const fakeUser = { id: '2', email: 'b@b.com', name: 'B' };
    (usersService.createUser as jest.Mock).mockResolvedValue(fakeUser);

    const res = await request(app).post('/api/users').send({ email: 'b@b.com', name: 'B' });
    expect(res.status).toBe(201);
  });

  it('debe retornar 400 con datos inválidos', async () => {
    const res = await request(app).post('/api/users').send({ email: 'no-email' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/users/:id', () => {
  it('debe retornar 200 al eliminar', async () => {
    (usersService.deleteUser as jest.Mock).mockResolvedValue(undefined);
    const res = await request(app).delete('/api/users/1');
    expect(res.status).toBe(200);
  });
});
