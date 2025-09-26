# DB Migrations Unification (Prisma-only)

## Changes
- Removed `node-pg-migrate` and scripts referencing it.
- Standardized Prisma location: `prisma/schema.prisma` in each service.
- Ensured presence of `prisma/migrations/` directory.
- Added consistent Prisma scripts in each service:
  - `prisma:generate`, `prisma:migrate:dev`, `prisma:migrate:deploy`, `prisma:db:push`
- Added root Docker Compose for local Postgres + Adminer: `docker-compose.dev.yml`
- Root helper scripts:
  - `scripts/migrate-all.sh`
  - `scripts/migrate-deploy-all.sh`

## How to run locally
1) `docker compose -f docker-compose.dev.yml up -d`
2) `pnpm -r install`
3) `./scripts/migrate-all.sh`
