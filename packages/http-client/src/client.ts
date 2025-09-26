import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ClientOptions, TokenProvider, RefreshHandler } from './types';
import { toApiError } from './errors';

let singleton: AxiosInstance | null = null;
let refreshing = false;

function resolveBaseURL(): string {
  if (typeof process !== 'undefined' && process.env) {
    const expo = process.env.EXPO_PUBLIC_API_BASE;
    const next = process.env.NEXT_PUBLIC_API_BASE;
    if (expo) return expo;
    if (next) return next;
  }
  return 'http://localhost:3000';
}

export function createApiClient(opts: ClientOptions = {}): AxiosInstance {
  if (singleton) return singleton;

  const baseURL = opts.baseURL || resolveBaseURL();
  const timeout = opts.timeoutMs ?? 15000;
  const getToken: TokenProvider | undefined = opts.getToken;
  const onRefreshToken: RefreshHandler | undefined = opts.onRefreshToken;

  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials: opts.withCredentials ?? false,
  });

  instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    // attach auth
    if (getToken) {
      try {
        const token = await Promise.resolve(getToken());
        if (token) {
          config.headers = config.headers || {};
          (config.headers as any)['Authorization'] = `Bearer ${token}`;
        }
      } catch {}
    }
    // idempotency for mutating methods
    const method = (config.method || 'get').toLowerCase();
    if (['post','put','patch','delete'].includes(method)) {
      config.headers = config.headers || {};
      if (!(config.headers as any)['Idempotency-Key']) {
        (config.headers as any)['Idempotency-Key'] = cryptoRandomId();
      }
    }
    // request id
    if (!(config.headers as any)['X-Request-Id']) {
      (config.headers as any)['X-Request-Id'] = cryptoRandomId();
    }
    return config;
  });

  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error) => {
      const err = toApiError(error);
      // try single refresh on 401
      if (err.status === 401 && onRefreshToken && !refreshing) {
        try {
          refreshing = true;
          const newToken = await Promise.resolve(onRefreshToken());
          refreshing = false;
          if (newToken) {
            // retry original request
            const original = error.config;
            original.headers = original.headers || {};
            (original.headers as any)['Authorization'] = `Bearer ${newToken}`;
            return instance.request(original);
          }
        } catch {
          refreshing = false;
        }
      }
      return Promise.reject(err);
    }
  );

  singleton = instance;
  return instance;
}

// util
function cryptoRandomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID();
  } catch {}
  return 'req_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Convenience methods
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await createApiClient().get<T>(url, config);
  return res.data as any;
}
export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const res = await createApiClient().post<T>(url, data, config);
  return res.data as any;
}
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const res = await createApiClient().put<T>(url, data, config);
  return res.data as any;
}
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await createApiClient().delete<T>(url, config);
  return res.data as any;
}
