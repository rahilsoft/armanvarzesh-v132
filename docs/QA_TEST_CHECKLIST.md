# QA Test Checklist (Phases 1–5)

## Preflight
- [ ] ENV valid and reachable services (Postgres/Redis/S3/OTEL)
- [ ] DB migrations executed

## API
- [ ] GraphQL major queries return within p95<300ms on sample dataset
- [ ] REST webhooks respond 200 and are idempotent
- [ ] BFF endpoints shape matches expected clients

## Media
- [ ] Upload -> confirm -> transcode/resize -> variant in same bucket
- [ ] Incorrect MIME/oversize rejected (if policy applied)

## Security
- [ ] Helmet headers present; CORS honors whitelist
- [ ] Rate limit effective (120 rpm/IP default)
- [ ] JWKS endpoint serves expected keys

## Observability
- [ ] `/metrics` up; counters increment as actions performed
- [ ] Traces exported to OTEL collector (check logs)

## CI/CD
- [ ] CI green; security workflow runs; preview artifacts attach
- [ ] Loadtest workflow succeeds against preview
