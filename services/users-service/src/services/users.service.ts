import { AppDataSource } from '../config/database';
import { UserEntity } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

const userRepo = () => AppDataSource.getRepository(UserEntity);

export async function getAllUsers(page = 1, limit = 10): Promise<[UserEntity[], number]> {
  return userRepo().findAndCount({
    where: { isActive: true },
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });
}

export async function getUserById(id: string): Promise<UserEntity> {
  const user = await userRepo().findOneBy({ id, isActive: true });
  if (!user) throw new Error('Usuario no encontrado');
  return user;
}

export async function createUser(dto: CreateUserDto): Promise<UserEntity> {
  const existing = await userRepo().findOneBy({ email: dto.email });
  if (existing) throw new Error('El email ya está en uso');

  const user = userRepo().create({ ...dto, role: dto.role ?? 'user' });
  return userRepo().save(user);
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<UserEntity> {
  const user = await getUserById(id);
  Object.assign(user, dto);
  return userRepo().save(user);
}

export async function deleteUser(id: string): Promise<void> {
  const user = await getUserById(id);
  user.isActive = false;
  await userRepo().save(user);
}
