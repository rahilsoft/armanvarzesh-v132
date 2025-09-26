import request from 'supertest';
import { createTestApp } from './utils/test-app';

const E = (n:string,d?:string)=>process.env[n]||d;

describe('payments e2e', () => {
  const enabled = E('E2E_PAY_ENABLED','false')==='true';
  (enabled ? it : it.skip)('create payment intent', async () => {
    const app = await createTestApp();
    const server = app.getHttpServer();
    const amount = Number(E('E2E_PAY_AMOUNT','1000'));
    const currency = E('E2E_PAY_CURRENCY','IRR');
    const res = await request(server).post('/payments/intent').send({ amount, currency });
    await app.close();
    expect(res.status).toBeLessThan(500);
  });
});
