import { Request, Response } from 'express';
import { sendSuccess, sendError, sendPaginated } from '@crud-ms/shared';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/users.service';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const [users, total] = await getAllUsers(page, limit);
    sendPaginated(res, users, total, page, limit);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error al obtener usuarios');
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const user = await getUserById(req.params['id']!);
    sendSuccess(res, user);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 404);
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const user = await createUser(req.body);
    sendSuccess(res, user, 'Usuario creado', 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error';
    sendError(res, msg, msg.includes('uso') ? 409 : 500);
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const user = await updateUser(req.params['id']!, req.body);
    sendSuccess(res, user, 'Usuario actualizado');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 404);
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteUser(req.params['id']!);
    sendSuccess(res, null, 'Usuario eliminado');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 404);
  }
}
