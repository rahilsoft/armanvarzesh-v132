# Phase 4 — Final Integration, E2E & Production Hardening

## 1) Connect to live backend
- In each PWA/Admin: copy `.env.example` to `.env.local`
- Set `NEXT_PUBLIC_USE_MOCK=false`
- Set `NEXT_PUBLIC_GRAPHQL_URL` / `NEXT_PUBLIC_API_URL` to staging/prod

## 2) Generate GraphQL types
```bash
npm run codegen
```

## 3) Security
- Backend services must enforce RBAC. Example added in `certificate-service` (`RolesGuard`, `@Roles('admin')`).

## 4) Observability
- Frontend event helper in `lib/analytics.ts` (PostHog-ready).
- Backend metrics: `/metrics` (Prometheus) and `/health` liveness.

## 5) Tests
- Unit (Jest) & E2E (Playwright) ready. Expand scenarios to cover booking/payment/courses once live endpoints exist.

## 6) CI/CD
- `.github/workflows/full-ci.yml` runs parity, build/tests; optional staging E2E via workflow_dispatch.
