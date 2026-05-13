import { Router } from 'express';
import { validateDto } from '@crud-ms/shared';
import { getAll, getById, create, update, remove } from '../controllers/products.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

const router = Router();

router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validateDto(CreateProductDto), create);
router.patch('/:id', validateDto(UpdateProductDto), update);
router.delete('/:id', remove);

export default router;
