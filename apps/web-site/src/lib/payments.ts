import { api } from './api';

export async function listPayments(limit = 20, cursor?: string, signal?: AbortSignal) {
  const res = await api.get('/payments', { params: { limit, cursor }, headers: { 'x-user-id': 'demo-web' }, signal });
  return res.data || res;
}
