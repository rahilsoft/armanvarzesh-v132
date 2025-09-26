
// k6 run scripts/k6-habits.js
import http from 'k6/http';
import { sleep, check } from 'k6';
export const options = {
  scenarios: {
    rps_burst: { executor: 'constant-arrival-rate', rate: 20, timeUnit: '1s', duration: '1m', preAllocatedVUs: 20 },
  },
  thresholds: { http_req_duration: ['p(50)<150', 'p(95)<400'] },
};
export default function () {
  const res = http.get(`${__ENV.API}/v1/habits/today`, { headers: { Authorization: `Bearer ${__ENV.TOKEN}` } });
  check(res, { 'status 200': (r)=> r.status === 200 });
  sleep(0.2);
}
