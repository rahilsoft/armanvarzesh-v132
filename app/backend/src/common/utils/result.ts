export type Ok<T> = { ok: true; data: T };
export type Err = { ok: false; error: string; details?: unknown };
export function ok<T>(data: T): Ok<T> { return { ok: true, data }; }
export function err(error: string, details?: unknown): Err { return { ok: false, error, details }; }
