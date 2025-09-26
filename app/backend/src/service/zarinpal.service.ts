import { http } from '@arman/http-client';

export class ZarinpalService {
  async requestPayment(amount: number, description: string) {
    try {
      const res = await http.post('https://example.com/zarinpal/request', { amount, description });
      return res.data;
    } catch (error) {
      const e = error as any;
      throw new Error('Zarinpal request failed: ' + (e?.message || 'unknown error'));
    }
  }

  async verifyPayment(authority: string, amount: number) {
    try {
      const res = await http.post('https://example.com/zarinpal/verify', { authority, amount });
      return res.data;
    } catch (error) {
      const e = error as any;
      throw new Error('Zarinpal verification failed: ' + (e?.message || 'unknown error'));
    }
  }
}
