import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../../src/services/users.service';
import { AppDataSource } from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  AppDataSource: { getRepository: jest.fn() },
}));

const mockRepo = {
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
});

describe('UsersService', () => {
  describe('getAllUsers', () => {
    it('debe retornar lista paginada', async () => {
      const fakeUsers = [{ id: '1', email: 'a@a.com' }];
      mockRepo.findAndCount.mockResolvedValue([fakeUsers, 1]);

      const [users, total] = await getAllUsers(1, 10);
      expect(users).toEqual(fakeUsers);
      expect(total).toBe(1);
      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
    });
  });

  describe('getUserById', () => {
    it('debe retornar el usuario si existe', async () => {
      const fakeUser = { id: '1', email: 'a@a.com' };
      mockRepo.findOneBy.mockResolvedValue(fakeUser);

      const user = await getUserById('1');
      expect(user).toEqual(fakeUser);
    });

    it('debe lanzar error si no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(getUserById('999')).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('createUser', () => {
    it('debe crear usuario si el email no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      const fakeUser = { id: '2', email: 'b@b.com', name: 'B' };
      mockRepo.create.mockReturnValue(fakeUser);
      mockRepo.save.mockResolvedValue(fakeUser);

      const result = await createUser({ email: 'b@b.com', name: 'B' });
      expect(result).toEqual(fakeUser);
    });

    it('debe lanzar error si el email ya está en uso', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: '1' });
      await expect(createUser({ email: 'existe@a.com', name: 'X' })).rejects.toThrow('en uso');
    });
  });

  describe('deleteUser', () => {
    it('debe desactivar el usuario (soft delete)', async () => {
      const fakeUser = { id: '1', isActive: true };
      mockRepo.findOneBy.mockResolvedValue(fakeUser);
      mockRepo.save.mockResolvedValue({ ...fakeUser, isActive: false });

      await deleteUser('1');
      expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
    });
  });
});
