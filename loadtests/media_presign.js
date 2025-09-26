import http from 'k6/http';
import { check } from 'k6';
export let options = { vus: 2, duration: '15s' };
const BASE = __ENV.BASE_URL || 'http://localhost:3000';
export default function () {
  const res = http.post(`${BASE}/media/presign`, JSON.stringify({ key: `test-${__ITER}.jpg`, contentType: 'image/jpeg' }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { '200': r => r.status === 201 || r.status === 200 });
}
