# @arman/contracts

> Type: **library** — Engines: Node 20.x, pnpm 9.x

## Overview
Short description of `@arman/contracts`. Explain purpose, boundaries, and main responsibilities.

## Getting Started
```bash
pnpm install
pnpm run build
pnpm run start
```

## Scripts
| Script | Command |
|---|---|
| `build` | `tsc -p tsconfig.json || echo "no tsc"` |
| `clean` | `rimraf dist || true` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `nodemon --exec ts-node src/main.ts || echo "dev script placeholder"` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx` |
| `prepare` | `husky install || true` |
| `prisma:generate` | `prisma generate` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:studio` | `prisma studio` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `node dist/main.js || next start -p 3000 || echo "no start"` |
| `start:prod` | `node dist/main.js` |
| `test` | `node tests/sample-consumer.mjs` |
| `test:cov` | `jest --coverage` |
| `test:e2e` | `echo "e2e placeholder"` |
| `typecheck` | `tsc -p tsconfig.json --noEmit || echo 'no tsconfig'` |

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
