import { Request, Response } from 'express';
import { sendSuccess, sendError, sendPaginated } from '@crud-ms/shared';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/products.service';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const category = req.query['category'] as string | undefined;
    const { products, total } = await getAllProducts(page, limit, category);
    sendPaginated(res, products, total, page, limit);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error al obtener productos');
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const product = await getProductById(req.params['id']!);
    sendSuccess(res, product);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 404);
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const product = await createProduct(req.body);
    sendSuccess(res, product, 'Producto creado', 201);
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error al crear producto', 500);
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const product = await updateProduct(req.params['id']!, req.body);
    sendSuccess(res, product, 'Producto actualizado');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 404);
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteProduct(req.params['id']!);
    sendSuccess(res, null, 'Producto eliminado');
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Error', 404);
  }
}
