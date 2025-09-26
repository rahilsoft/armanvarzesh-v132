import { http } from '@arman/http-client';

const apiClient = http.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = (url: string, params = {}) => apiClient.get(url, { params });

export const post = (url: string, data = {}) => apiClient.post(url, data);

export const put = (url: string, data = {}) => apiClient.put(url, data);

export const del = (url: string) => apiClient.delete(url);

export default apiClient;