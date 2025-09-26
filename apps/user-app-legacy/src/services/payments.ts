import { api } from './api';
import { authStore } from '@arman/state';

export async function createPayment(amountCents: number, currency = 'IRR', signal?: AbortSignal) {
  const { user } = authStore.getState();
  const userId = user?.id || user?.username || 'demo-user';
  const res = await api.post('/payments', { userId, amountCents, currency }, { signal });
  return res.data || res;
}


export async function listPayments(limit = 20, cursor?: string) {
  const headers: any = {};
  // demo header for user; in real app it should come from token claims
  headers['x-user-id'] = 'demo-user';
  const res = await api.get('/payments', { params: { limit, cursor }, headers });
  return res.data || res;
}
