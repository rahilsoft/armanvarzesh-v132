import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/** HttpClient
 *  Axios wrapper with sane defaults (timeout, retry for 5xx/Network errors).
 *  Use `retry` option in request config to customize attempts (default: 2).
 */
class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = http.create({
      timeout: 10000,
      headers: { 'User-Agent': 'ArmanFit/1.0' },
    });

    this.instance.interceptors.response.use(
      (resp) => resp,
      async (error) => {
        const cfg = error.config as AxiosRequestConfig & { __retryCount?: number; retry?: number };
        const status = error.response?.status;
        const isRetriable = !status || (status >= 500 && status < 600);
        const maxRetries = (cfg as any).retry ?? 2;
        cfg.__retryCount = (cfg.__retryCount ?? 0) + 1;
        if (isRetriable && cfg.__retryCount <= maxRetries) {
          return this.instance(cfg);
        }
        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }
}

export const httpClient = new HttpClient();