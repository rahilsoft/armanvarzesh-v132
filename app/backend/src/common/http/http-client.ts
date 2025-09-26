/** Axios-based HTTP client with auth + error shaping. */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
export class HttpClient {
  private readonly client: AxiosInstance;
  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.client = axios.create({ baseURL, timeout: 15000, headers: { 'Content-Type': 'application/json', ...defaultHeaders } });
    this.client.interceptors.request.use((config) => { const token = process.env.INTERNAL_API_TOKEN || process.env.ADMIN_API_TOKEN; if (token) { config.headers = config.headers || {}; (config.headers as any)['Authorization'] = `Bearer ${token}`; } return config; });
    this.client.interceptors.response.use((res) => res, async (error) => { const status = error?.response?.status || 0; const data = error?.response?.data; const message = data?.error || data?.message || error?.message || 'HTTP error'; return Promise.reject({ status, message, data }); });
  }
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> { return this.client.get<T>(url, config); }
  post<T = unknown>(url: string, body?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> { return this.client.post<T>(url, body, config); }
  put<T = unknown>(url: string, body?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> { return this.client.put<T>(url, body, config); }
  patch<T = unknown>(url: string, body?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> { return this.client.patch<T>(url, body, config); }
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> { return this.client.delete<T>(url, config); }
}
