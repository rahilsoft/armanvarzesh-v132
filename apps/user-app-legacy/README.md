
# ArmanVarzesh User App

This is the official mobile client for users of ArmanVarzesh platform.

## Features
- Login, Register, Profile Management
- Workout creation, tracking and analytics
- Nutrition planning and logging
- Leaderboards, Challenges, Wallet, Marketplace and Payments
- Push Notifications, Surveys, Live Sessions and more

## Getting Started
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Run `npm install`
- Start the project: `npm start`
    


| Script | Command |
|---|---|
| `android` | `expo start --android` |
| `build` | `tsc -p tsconfig.json` |
| `clean` | `rimraf dist || true` |
| `codegen` | `graphql-codegen` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `nodemon --watch src --exec ts-node src/main.ts` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `ios` | `expo start --ios` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx` |
| `prepare` | `husky install || true` |
| `prisma:generate` | `prisma generate` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:studio` | `prisma studio` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `expo start` |
| `start:prod` | `node dist/main.js` |
| `test` | `jest --passWithNoTests` |
| `test:cov` | `jest --coverage` |
| `test:coverage` | `jest --coverage` |
| `test:e2e` | `echo "e2e placeholder"` |
| `test:watch` | `jest --watch` |
| `typecheck` | `tsc -p tsconfig.json --noEmit || echo 'no tsconfig'` |
| `web` | `expo start --web` |

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
