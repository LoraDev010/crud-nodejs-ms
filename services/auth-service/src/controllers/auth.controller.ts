import { Request, Response } from 'express';
import { sendSuccess, sendError } from '@crud-ms/shared';
import { registerUser, loginUser, refreshTokens } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const user = await registerUser(req.body as RegisterDto);
    const { passwordHash: _, ...safeUser } = user;
    sendSuccess(res, safeUser, 'Usuario registrado correctamente', 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al registrar';
    sendError(res, message, message.includes('registrado') ? 409 : 500);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const tokens = await loginUser(req.body as LoginDto);
    sendSuccess(res, tokens, 'Login exitoso');
  } catch (err) {
    sendError(res, 'Credenciales inválidas', 401);
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) { sendError(res, 'Refresh token requerido', 400); return; }
    const tokens = await refreshTokens(refreshToken);
    sendSuccess(res, tokens, 'Tokens renovados');
  } catch {
    sendError(res, 'Refresh token inválido o expirado', 401);
  }
}
