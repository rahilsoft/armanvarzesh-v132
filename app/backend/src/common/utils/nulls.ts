import { requireEnv } from './nulls';
/** Null-safety helpers (Phase 4 — Step 17) */
export function isNonNullish<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

export function assertDefined<T>(v: T | null | undefined, name = 'value'): asserts v is T {
  if (v === null || v === undefined) {
    throw new Error(`${name} is required`);
  }
}

export function coalesce<T>(...values: (T | null | undefined)[]): T | undefined {
  for (const v of values) { if (isNonNullish(v)) return v as T; }
  return undefined;
}

/** Require env var or throw early (avoids `requireEnv('X')`). */
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}
