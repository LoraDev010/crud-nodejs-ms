import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/api-response.type';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
  const body: ApiResponse<T> = { success: true, data, message, statusCode };
  return res.status(statusCode).json(body);
}

export function sendError(res: Response, error: string, statusCode = 500): Response {
  const body: ApiResponse = { success: false, error, statusCode };
  return res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    statusCode: 200,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
  return res.status(200).json(body);
}
