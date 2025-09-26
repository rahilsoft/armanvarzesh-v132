// k6 smoke test for Gateway
// Usage: K6_TARGET=http://localhost:8080 k6 run smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<800'],
  },
};

const BASE = __ENV.K6_TARGET || 'http://localhost:8080';

export default function () {
  const g = http.post(`${BASE}/bff/graphql`, JSON.stringify({ query: '{ dashboardBundle { warnings } }' }), { headers: { 'content-type': 'application/json' } });
  check(g, { 'bff 200': (r) => r.status === 200 });
  const h = http.get(`${BASE}/health`);
  check(h, { 'health 200': (r) => r.status === 200 });
  sleep(1);
}
