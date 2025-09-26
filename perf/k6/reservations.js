// k6 scenario: reservations flow (pseudo)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '1m',
};

const BASE = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
  // replace with real endpoints/GraphQL mutation names
  const res = http.get(`${BASE}/health`);
  check(res, { 'ok': (r) => r.status === 200 });
  sleep(0.5);
}
