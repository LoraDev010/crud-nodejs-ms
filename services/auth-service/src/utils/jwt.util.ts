import jwt from 'jsonwebtoken';
import { JwtPayload } from '@crud-ms/shared';
import { jwtConfig } from '../config/jwt.config';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function signTokens(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair {
  const accessToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, jwtConfig.secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
}
