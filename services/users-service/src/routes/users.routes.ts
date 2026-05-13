import { Router } from 'express';
import { validateDto } from '@crud-ms/shared';
import { getAll, getById, create, update, remove } from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateDto(CreateUserDto), create);
router.patch('/:id', validateDto(UpdateUserDto), update);
router.delete('/:id', remove);

export default router;
