import { signTokens, verifyAccessToken, verifyRefreshToken } from '../../src/utils/jwt.util';

process.env.JWT_SECRET = 'test_secret_minimo_32_caracteres_ok';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_minimo_32_chars';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('JwtUtil', () => {
  const payload = { sub: 'user-123', email: 'test@test.com', role: 'user' as const };

  describe('signTokens', () => {
    it('debe generar accessToken y refreshToken', () => {
      const { accessToken, refreshToken } = signTokens(payload);
      expect(typeof accessToken).toBe('string');
      expect(typeof refreshToken).toBe('string');
      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('debe verificar y retornar el payload correcto', () => {
      const { accessToken } = signTokens(payload);
      const decoded = verifyAccessToken(accessToken);
      expect(decoded.sub).toBe('user-123');
      expect(decoded.email).toBe('test@test.com');
    });

    it('debe lanzar error con token inválido', () => {
      expect(() => verifyAccessToken('token.invalido.aqui')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('debe verificar el refresh token correctamente', () => {
      const { refreshToken } = signTokens(payload);
      const decoded = verifyRefreshToken(refreshToken);
      expect(decoded.sub).toBe('user-123');
    });
  });
});
