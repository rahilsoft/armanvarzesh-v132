import http from 'k6/http';
import { check } from 'k6';
export let options = { vus: 2, duration: '15s' };
const BASE = __ENV.BASE_URL || 'http://localhost:3000';
export default function () {
  const payload = { id: `evt_${__ITER}`, orderId: 'order1', amount: 1000, status: 'SUCCEEDED' };
  const res = http.post(`${BASE}/payments/webhook`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
  check(res, { '200': r => r.status === 200 });
}
