import type { ApiError } from './types';

export function toApiError(err: any): ApiError {
  if (err?.isAxiosError) {
    return {
      message: err.response?.data?.error || err.response?.data?.message || err.message || 'Request failed',
      status: err.response?.status,
      code: err.response?.data?.code || err.code,
      isNetworkError: !err.response,
      details: err.response?.data,
    };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: String(err) };
}
