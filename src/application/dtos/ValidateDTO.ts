// Application Layer - DTO Validation Helper
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export async function validateDTO<T extends object>(
  dtoClass: new () => T,
  data: any
): Promise<{ isValid: boolean; errors: string[]; dto?: T }> {
  // Transform plain object to class instance
  const dtoInstance = plainToClass(dtoClass, data);

  // Validate
  const validationErrors = await validate(dtoInstance);

  if (validationErrors.length > 0) {
    const errors = validationErrors.map((error) =>
      Object.values(error.constraints || {}).join(', ')
    );
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [], dto: dtoInstance };
}
