import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: __ENV.VUS ? parseInt(__ENV.VUS) : 10,
  duration: __ENV.DURATION || '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'], // ms
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE}/healthz`);
  check(res, { 'status ok': (r) => [200,204].includes(r.status) });
  sleep(1);
}
