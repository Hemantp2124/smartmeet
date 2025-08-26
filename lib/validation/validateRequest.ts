// lib/validation/validateRequest.ts
import { z, ZodSchema } from 'zod';
import { ApiError } from '../middleware/errorHandler';

export async function validateRequest<T extends ZodSchema>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError('Invalid request data', 400, error.errors);
    }
    throw new ApiError('Invalid JSON', 400);
  }
}