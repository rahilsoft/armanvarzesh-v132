/**
SanitizePipe
Deeply sanitizes incoming JSON payloads to mitigate prototype pollution and NoSQL-style injections.
@remarks
- Drops keys: `__proto__`, `constructor`, `prototype`, and any key starting with `$`.
- Rejects keys containing `.` to avoid MongoDB dot-notation injection.
*/
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

function isPlainObject(x: any) { return x && typeof x === 'object' && !Array.isArray(x); }

function sanitizeDeep(obj: any, path: string[] = []): any {
  if (Array.isArray(obj)) return obj.map((v, i) => sanitizeDeep(v, path.concat(String(i))));
  if (!isPlainObject(obj)) return obj;
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype' || k.startsWith('$')) {
      // drop dangerous keys
      continue;
    }
    if (k.includes('.')) {
      // mongodb dot-notation injection
      throw new BadRequestException(`invalid key at ${[...path, k].join('.')}`);
    }
    out[k] = sanitizeDeep(v, path.concat(k));
  }
  return out;
}

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, _meta: ArgumentMetadata): any {
    if (value == null) return value;
    return sanitizeDeep(value);
  }
}
