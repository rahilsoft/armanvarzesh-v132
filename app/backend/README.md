# @arman/backend

> Type: **backend (NestJS)** — Engines: Node 20.x, pnpm 9.x

## Overview
Short description of `@arman/backend`. Explain purpose, boundaries, and main responsibilities.

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
| `clean` | `rimraf dist || true` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `ts-node -r tsconfig-paths/register src/main.ts` |
| `e2e` | `vitest run -r ./e2e` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx || echo "no eslint"` |
| `prepare` | `husky install || true` |
| `prisma:generate` | `prisma generate --schema src/database/prisma/schema.prisma` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:migrate:deploy` | `prisma migrate deploy --schema ./src/database/prisma/schema.prisma` |
| `prisma:migrate:dev` | `prisma migrate dev --schema src/database/prisma/schema.prisma` |
| `prisma:studio` | `prisma studio --schema src/database/prisma/schema.prisma` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `seed` | `ts-node -r tsconfig-paths/register src/scripts/seed.ts || echo "seed skipped"` |
| `start` | `node -r tsconfig-paths/register dist/main.js` |
| `start:dev` | `nest start --watch` |
| `start:prod` | `node -r tsconfig-paths/register dist/main.js` |
| `test` | `jest --passWithNoTests || vitest run || echo "no tests"` |
| `test:cov` | `jest --coverage` |
| `test:coverage` | `jest --coverage` |
| `test:e2e` | `jest -c e2e/jest.e2e.config.ts` |
| `test:watch` | `jest --watch` |
| `typecheck` | `tsc -p tsconfig.build.json --noEmit` |
| `typecheck:full` | `tsc -p tsconfig.json --noEmit` |

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
