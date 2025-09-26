# @arman/analytics-service

> Type: **backend (NestJS)** — Engines: Node 20.x, pnpm 9.x

## Overview
Short description of `@arman/analytics-service`. Explain purpose, boundaries, and main responsibilities.

## Getting Started
```bash
pnpm install
pnpm run build
pnpm run start
```

## Scripts
| Script | Command |
|---|---|
| `build` | `tsc -p tsconfig.build.json` |
| `clean` | `rimraf dist || rm -rf dist` |
| `coverage` | `echo "no coverage"` |
| `lint` | `eslint .` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `node dist/main.js` |
| `start:dev` | `nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts || nest start --watch` |
| `start:prod` | `node dist/main.js` |
| `test` | `echo "NO_TESTS" && exit 0` |
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
