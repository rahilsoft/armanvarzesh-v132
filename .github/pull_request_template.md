
## What
- [ ] Typesafe end-to-end (DTO/Schema/Validation)
- [ ] DB migrations + rollback + seeds
- [ ] Unit/Integration/E2E tests added (target ≥80% new code)
- [ ] Security: rate-limit/audit logs considered; secrets untouched or rotated
- [ ] Observability: metrics + dashboards/alerts updated
- [ ] Accessibility AA for new/changed screens
- [ ] Performance budgets met (API p50 < 150 ms; ingest lag < 60 s)
- [ ] Contracts updated in `/contracts`
- [ ] Docs: CHANGELOG + ADR + MIGRATIONS updated

## How to test
- Commands:
```
pnpm -w run build
pnpm -w run test
node scripts/latency-check.js <url> 50
```
