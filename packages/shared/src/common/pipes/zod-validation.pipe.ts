import { PipeTransform, BadRequestException } from '@nestjs/common';

/**
 * Generic Zod-backed validation pipe. Accepts any object exposing a
 * `parse`/`safeParse` method (a Zod schema) and validates the incoming value.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: unknown): unknown {
    try {
      if (this.schema && typeof this.schema.parse === 'function') {
        return this.schema.parse(value);
      }
      return value;
    } catch (err: any) {
      throw new BadRequestException(err?.errors ?? err?.message ?? 'Validation failed');
    }
  }
}
