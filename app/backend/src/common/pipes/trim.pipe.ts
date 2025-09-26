import { Injectable, PipeTransform } from '@nestjs/common';

/** TrimPipe
 *  Trims string inputs while leaving other types unchanged.
 */
@Injectable()
export class TrimPipe implements PipeTransform<unknown> {
  transform<T = unknown>(value: T): T {
    if (typeof value === 'string') return (value as unknown as string).trim() as unknown as T;
    return value;
  }
}