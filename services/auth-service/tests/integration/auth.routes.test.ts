import request from 'supertest';
import { createApp } from '../../src/app';
import * as authService from '../../src/services/auth.service';

jest.mock('../../src/services/auth.service');
jest.mock('../../src/config/database', () => ({
  AppDataSource: { getRepository: jest.fn(), initialize: jest.fn() },
  initDatabase: jest.fn(),
}));

const app = createApp();

describe('POST /api/auth/register', () => {
  it('debe registrar un usuario y retornar 201', async () => {
    const fakeUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' };
    (authService.registerUser as jest.Mock).mockResolvedValue(fakeUser);

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('test@test.com');
  });

  it('debe retornar 400 con datos inválidos', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'no-es-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  it('debe retornar tokens con credenciales válidas', async () => {
    (authService.loginUser as jest.Mock).mockResolvedValue({
      accessToken: 'acc_token',
      refreshToken: 'ref_token',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('debe retornar 401 con credenciales inválidas', async () => {
    (authService.loginUser as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });
});

describe('GET /health', () => {
  it('debe retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
