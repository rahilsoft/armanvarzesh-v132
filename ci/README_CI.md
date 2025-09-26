# CI Notes (Codemagic)

## Why builds were failing
Codemagic logs showed `Required secret DATABASE_URL is not set` during **Prisma generate**. Prisma requires the `DATABASE_URL` env var to exist even when only running code generation. It does **not** connect to the database during `prisma generate`, but it still validates the presence of the variable.

## Quick fixes
1. **Set a safe fallback in CI**: In `ci/codemagic-patched.yaml`, we export a non-production `CI_DATABASE_URL` and then set `DATABASE_URL=${DATABASE_URL:-$CI_DATABASE_URL}` before running Prisma.
2. **(Recommended) Add real secrets in Codemagic**: In the Codemagic UI, add the following secure env variables:
   - `DATABASE_URL` (PostgreSQL connection string for dev/staging)
   - Any other required secrets used by your services (JWT_*, REDIS_URL, etc.)

## How to use this config
- Either replace your root `codemagic.yaml` with `ci/codemagic-patched.yaml`
- Or merge the `Prepare Prisma generate` step into your existing workflow.

## Notes
- The pipeline uses pnpm (`corepack enable; corepack prepare pnpm@9.6.0 --activate`).
- Installs dependencies once, then runs prisma generate across all packages that contain a Prisma schema.
- Proceeds with type-check, build, and test for all workspaces if scripts exist.
