# SLOs (Initial)

## API (Backend)
- Availability (monthly): 99.9%
- Latency: p95 < 400ms (read), p95 < 700ms (write)
- Error rate: < 1% 5xx over 5m

## Web
- Largest Contentful Paint (LCP): p75 < 2.5s (staging), < 2.0s (prod)
- PWA score: ≥ 0.9 (Lighthouse CI)

## Alerts
- Uptime check fails ×3 → page on-call
- p95 latency > SLO for 10m → warn
- 5xx rate > 1% for 5m → page
