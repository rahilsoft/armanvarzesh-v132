
# Performance Budgets & SLOs (Phase 8)

## API
- **p50 < 150 ms**, p95 < 400 ms (intra-cluster). Enforced via k6 thresholds & `scripts/latency-check.js` exit codes.

## Wearables Ingestion
- Lag < 60 s (p50). Alert when > 30 s for 5m (see Prometheus rules).

## GPS Sample Loss
- < 1% over 30 min at 1 Hz; tracked in perf docs & dashboards.

## Mobile
- RN screens target AA; headers get `accessibilityRole="header"`. Color-contrast rules in design system.
