/** Domain Result type (separate from transport-level result) */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
export const Ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const Err = (error: string): Result<never> => ({ ok: false, error });
