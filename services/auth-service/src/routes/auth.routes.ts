import { Router } from 'express';
import { validateDto } from '@crud-ms/shared';
import { register, login, refresh } from '../controllers/auth.controller';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

const router = Router();

router.post('/register', validateDto(RegisterDto), register);
router.post('/login', validateDto(LoginDto), login);
router.post('/refresh', refresh);

export default router;
