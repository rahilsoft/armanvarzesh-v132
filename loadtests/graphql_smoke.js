import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = { vus: 5, duration: '30s' };
const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const q = JSON.stringify({ query: '{ __typename }' });
  const res = http.post(`${BASE}/graphql`, q, { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'status is 200': r => r.status === 200 });
  sleep(1);
}
