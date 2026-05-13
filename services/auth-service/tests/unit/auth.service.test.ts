import { registerUser, loginUser, refreshTokens } from '../../src/services/auth.service';
import * as hashUtil from '../../src/utils/hash.util';
import * as jwtUtil from '../../src/utils/jwt.util';
import { AppDataSource } from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('../../src/utils/hash.util');
jest.mock('../../src/utils/jwt.util');

const mockRepo = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
});

describe('AuthService', () => {
  describe('registerUser', () => {
    it('debe registrar un usuario nuevo correctamente', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      (hashUtil.hashPassword as jest.Mock).mockResolvedValue('hash123');
      const fakeUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' };
      mockRepo.create.mockReturnValue(fakeUser);
      mockRepo.save.mockResolvedValue(fakeUser);

      const result = await registerUser({ email: 'test@test.com', password: 'pass1234', name: 'Test' });

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(hashUtil.hashPassword).toHaveBeenCalledWith('pass1234');
      expect(result).toEqual(fakeUser);
    });

    it('debe lanzar error si el email ya existe', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: '1', email: 'test@test.com' });

      await expect(
        registerUser({ email: 'test@test.com', password: 'pass1234', name: 'Test' }),
      ).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('loginUser', () => {
    it('debe retornar tokens con credenciales válidas', async () => {
      const fakeUser = { id: '1', email: 'test@test.com', role: 'user', passwordHash: 'hash' };
      mockRepo.findOneBy.mockResolvedValue(fakeUser);
      (hashUtil.comparePasswords as jest.Mock).mockResolvedValue(true);
      (jwtUtil.signTokens as jest.Mock).mockReturnValue({ accessToken: 'acc', refreshToken: 'ref' });

      const result = await loginUser({ email: 'test@test.com', password: 'pass1234' });

      expect(result).toEqual({ accessToken: 'acc', refreshToken: 'ref' });
    });

    it('debe lanzar error con credenciales inválidas', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(loginUser({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('debe lanzar error si la contraseña no coincide', async () => {
      mockRepo.findOneBy.mockResolvedValue({ passwordHash: 'hash' });
      (hashUtil.comparePasswords as jest.Mock).mockResolvedValue(false);

      await expect(loginUser({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(
        'Credenciales inválidas',
      );
    });
  });

  describe('refreshTokens', () => {
    it('debe retornar nuevos tokens con refresh token válido', async () => {
      (jwtUtil.verifyRefreshToken as jest.Mock).mockReturnValue({ sub: '1', email: 'e@e.com', role: 'user' });
      mockRepo.findOneBy.mockResolvedValue({ id: '1', email: 'e@e.com', role: 'user' });
      (jwtUtil.signTokens as jest.Mock).mockReturnValue({ accessToken: 'new_acc', refreshToken: 'new_ref' });

      const result = await refreshTokens('valid_refresh');
      expect(result.accessToken).toBe('new_acc');
    });
  });
});
