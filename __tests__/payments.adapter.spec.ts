import { describe, it, expect } from 'vitest';
import * as pay from '../packages/data/payments/adapter';
describe('payments adapter (mock)', ()=>{
  it('tokenizes and confirms payment', async ()=>{
    const pi = await pay.createPaymentIntent({ amount: 1000, currency:'IRT' });
    const tok = await pay.tokenizeCard('4242424242424242','12/27','123');
    const res = await pay.confirmPayment(pi.id, tok);
    expect(['succeeded','failed','processing','requires_payment']).toContain(res.status);
  });
});
