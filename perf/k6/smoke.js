// k6 smoke test: health endpoint with thresholds
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5, duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
  summaryTrendStats: ['avg','min','med','p(90)','p(95)','max'],
};

const BASE = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
  const res = http.get(`${BASE}/health`);
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'perf/k6/smoke-summary.json': JSON.stringify(data, null, 2),
  };
}
