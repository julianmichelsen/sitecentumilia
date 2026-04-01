import { ZodSchema } from 'zod';

export type ValidationErrors = Record<string, string[] | undefined>;

export function validate<T>(schema: ZodSchema<T>, payload: unknown):
  | { success: true; data: T }
  | { success: false; errors: ValidationErrors } {
  const result = schema.safeParse(payload);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  return { success: true, data: result.data };
}
