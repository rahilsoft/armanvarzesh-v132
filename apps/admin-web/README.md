# armanfit-admin

**Build Target:** Node 20, pnpm 9.6.0

## Quickstart

```bash
corepack enable
corepack prepare pnpm@9.6.0 --activate

# from repo root
pnpm -w install

# typecheck & build only this service
pnpm --filter . run typecheck
pnpm --filter . run build

# run
pnpm --filter . run start
```

## Notes
- No `postinstall`, no migrations, no db push in install/build.
- Output lands in `dist/` (CommonJS).
- If Prisma exists, use `pnpm run prisma:generate` explicitly (outside install/build).



| Script | Command |
|---|---|
| `build` | `tsc -p tsconfig.build.json` |
| `build-storybook` | `storybook build` |
| `clean` | `rimraf dist || true` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `ts-node src/main.ts` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx || echo "no eslint"` |
| `prepare` | `husky install || true` |
| `preview` | `vite preview` |
| `prisma:generate` | `prisma generate` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:studio` | `prisma studio` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `node dist/main.js` |
| `start:prod` | `node dist/main.js` |
| `storybook` | `storybook dev -p 6007` |
| `test` | `jest --passWithNoTests || vitest run || echo "no tests"` |
| `test:cov` | `jest --coverage` |
| `test:e2e` | `echo "e2e placeholder"` |
| `typecheck` | `tsc -p tsconfig.build.json --noEmit` |

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
