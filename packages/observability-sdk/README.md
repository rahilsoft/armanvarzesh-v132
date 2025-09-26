# @arman/observability-sdk (thin)

- Minimal, dependency-light facade:
  - Initializes prom-client with default metrics and domain labels
  - Starts a tiny `/metrics` HTTP endpoint on `METRICS_PORT` (default 9464)
- Environment:
  - `OTEL_SERVICE_NAME` (optional)
  - `OTEL_ENVIRONMENT` (optional, default NODE_ENV)
  - `METRICS_PORT` (default 9464), `METRICS_PATH` (default `/metrics`)
- For full tracing, add `@opentelemetry/sdk-node` and auto-instrumentations in this package later and call `initOpenTelemetry` accordingly.


| Script | Command |
|---|---|
| `build` | `tsup src/index.ts src/register.ts --dts --format esm,cjs --out-dir dist --clean` |
| `coverage` | `echo "no coverage"` |
| `dev` | `tsup src/index.ts src/register.ts --watch --dts --format esm,cjs --out-dir dist` |
| `lint` | `eslint . --max-warnings=0 --ext .ts,.tsx,.js,.jsx || echo "eslint not configured"` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `node dist/index.js || echo "no start"` |
| `test` | `echo "no tests" && exit 0` |
| `typecheck` | `tsc -p tsconfig.json --noEmit` |

## Environment
Use `.env` or inherit from repo root. Required variables (examples):
- `DATABASE_URL` — Postgres connection string
- `REDIS_URL` — Redis connection string
- `JWT_SECRET` — JWT signing secret
- `CORS_ORIGIN` — Comma-separated origins (e.g. https://app.example.com,https://admin.example.com)

## Development
- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Tests: `pnpm run test` (coverage: `pnpm run coverage`)

## Deployment
- Containerized via Dockerfile (if present). Healthcheck: `GET /health`, Metrics: `GET /metrics` (Prometheus).
- See repo Release workflow for build & publish (GHCR).

## Security
- No secrets in repo. Use env variables or secret manager. Helmet/CORS configured in Nest/Next.

---
_This README was scaffolded in Phase 8 (Docs) to standardize documentation across the monorepo._
