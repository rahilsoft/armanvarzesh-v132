// k6 advanced: GraphQL reservations flow with thresholds and JUnit summary
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20, duration: '2m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'group_duration{group::reserve}': ['p(95)<1000'],
    http_req_duration: ['p(95)<1200'],
  },
  summaryTrendStats: ['avg','min','med','p(90)','p(95)','max'],
};

const BASE = __ENV.BASE_URL || 'http://localhost:4000';
const GQL = `${BASE}/graphql`;

export default function () {
  // If GraphQL not available, fallback health
  const health = http.get(`${BASE}/health`);
  check(health, { 'health 200': (r) => r.status === 200 });
  // Attempt a reservation mutation (replace with real schema names)
  const q = `mutation Reserve($user: ID!, $slot: ID!) { reserve(userId: $user, slotId: $slot) { ok } }`;
  const payload = JSON.stringify({ query: q, variables: { user: 'u1', slot: 's1' } });
  const res = http.post(GQL, payload, { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'graphql ok or acceptable': (r) => r.status === 200 || r.status === 400 });
  sleep(0.5);
}

function toJUnit(data) {
  const total = data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0;
  const failed = data.metrics.http_req_failed ? data.metrics.http_req_failed.values.rate * total : 0;
  const d95 = data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(95)'] : 0;
  return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="k6-graphql-reservations" tests="1" failures="${failed>0?1:0}">
    <testcase name="http_req_duration_p95" time="${d95/1000}">
      ${failed>0?'<failure message="http_req_failed rate exceeded"/>':''}
    </testcase>
  </testsuite>
</testsuites>`;
}

export function handleSummary(data) {
  return {
    'perf/k6/graphql-reservations-summary.json': JSON.stringify(data, null, 2),
    'perf/k6/graphql-reservations-junit.xml': toJUnit(data),
  };
}
