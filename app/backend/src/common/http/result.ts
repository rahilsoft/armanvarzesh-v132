export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; code?: string | number };
export const Ok = <T>(data: T): ApiResult<T> => ({ ok: true, data });
export const Err = (error: string, code?: string | number): ApiResult<never> => ({ ok: false, error, code });
