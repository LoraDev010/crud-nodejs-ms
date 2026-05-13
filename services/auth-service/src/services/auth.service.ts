import { AppDataSource } from '../config/database';
import { UserEntity } from '../models/user.model';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { hashPassword, comparePasswords } from '../utils/hash.util';
import { signTokens, verifyRefreshToken, TokenPair } from '../utils/jwt.util';

const userRepo = () => AppDataSource.getRepository(UserEntity);

export async function registerUser(dto: RegisterDto): Promise<UserEntity> {
  const existing = await userRepo().findOneBy({ email: dto.email });
  if (existing) throw new Error('El email ya está registrado');

  const passwordHash = await hashPassword(dto.password);
  const user = userRepo().create({
    email: dto.email,
    passwordHash,
    name: dto.name,
    role: dto.role ?? 'user',
  });
  return userRepo().save(user);
}

export async function loginUser(dto: LoginDto): Promise<TokenPair> {
  const user = await userRepo().findOneBy({ email: dto.email, isActive: true });
  if (!user) throw new Error('Credenciales inválidas');

  const valid = await comparePasswords(dto.password, user.passwordHash);
  if (!valid) throw new Error('Credenciales inválidas');

  return signTokens({ sub: user.id, email: user.email, role: user.role });
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  const payload = verifyRefreshToken(refreshToken);
  const user = await userRepo().findOneBy({ id: payload.sub, isActive: true });
  if (!user) throw new Error('Usuario no encontrado');

  return signTokens({ sub: user.id, email: user.email, role: user.role });
}
