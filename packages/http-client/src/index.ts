import axios, { AxiosInstance } from 'axios';

export interface HttpOptions {
  timeoutMs?: number;
  retries?: number;
}

export function makeHttpClient(opts: HttpOptions = {}): AxiosInstance {
  const timeout = opts.timeoutMs ?? 5000;
  const retries = opts.retries ?? 2;
  const client = http.create({ timeout, maxRedirects: 0, validateStatus: (s) => s >= 200 && s < 500 });

  client.interceptors.response.use(undefined, async (error) => {
    const cfg: any = error.config || {};
    cfg.__retryCount = (cfg.__retryCount || 0) + 1;
    if (cfg.__retryCount <= retries) {
      return client(cfg);
    }
    return Promise.reject(error);
  });

  return client;
}

export const http = makeHttpClient();

export type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
