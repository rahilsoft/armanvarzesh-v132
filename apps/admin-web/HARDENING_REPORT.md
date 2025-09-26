# Service Hardening Report

**Service Path:** `armanvarzesh_v41/apps/armanfit-admin`  
**Timestamp:** 2025-08-19T06:18:18.091808Z

## Summary
- Node set to **20** via `.nvmrc` and `.node-version` at repo root.
- pnpm set to **9.6.0** via root `package.json#packageManager`.
- Standardized scripts; removed any `postinstall`/side-effect scripts.
- Ensured `tsconfig.json` + `tsconfig.build.json` exist with CJS/ES2020 and `dist/` outDir.
- Entry point: `src/main.ts` ensured (minimal bootstrap).
- GraphQL upgraded to Apollo v4 stack if GraphQL was detected.
- Prisma (if present): `prisma generate` supported; no migrations in install/build.
- `.env.example` added with minimal variables.
- Added per-service CI workflow for typecheck/build-only.

## Scripts (Before → After)
**Before:**
```json
{
  "start": "node dist/main.js",
  "build": "tsc -p tsconfig.build.json",
  "dev": "ts-node src/main.ts",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "storybook": "storybook dev -p 6007",
  "build-storybook": "storybook build",
  "preview": "vite preview",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "test:cov": "jest --coverage",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "format:check": "prettier -c . || echo \"no prettier\""
}
```
**After:**
```json
{
  "start": "node dist/main.js",
  "build": "tsc -p tsconfig.build.json",
  "dev": "ts-node src/main.ts",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "storybook": "storybook dev -p 6007",
  "build-storybook": "storybook build",
  "preview": "vite preview",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "test:cov": "jest --coverage",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "format:check": "prettier -c . || echo \"no prettier\""
}
```

## Dependencies Changes
- **Added:** []
- **Removed:** []

## New/Updated Files
- `.nvmrc`
- `.node-version`
- `package.json` (updated/created; set packageManager)
- `armanvarzesh_v41/apps/armanfit-admin/tsconfig.json`
- `armanvarzesh_v41/apps/armanfit-admin/tsconfig.build.json`
- `armanvarzesh_v41/apps/armanfit-admin/src/main.ts` (created if absent)
- `armanvarzesh_v41/apps/armanfit-admin/.env.example`
- `armanvarzesh_v41/apps/armanfit-admin/README.md`
- `.github/workflows/armanfit-admin-ci.yml`

## How to Run (Local)
```bash
corepack enable
corepack prepare pnpm@9.6.0 --activate
pnpm -w install

pnpm --filter './armanvarzesh_v41/apps/armanfit-admin' run typecheck
pnpm --filter './armanvarzesh_v41/apps/armanfit-admin' run build
pnpm --filter './armanvarzesh_v41/apps/armanfit-admin' run start
```

> Note: No database migrations, seeds, or pushes are executed automatically. If Prisma is present and you need types, run:
```bash
pnpm --filter './armanvarzesh_v41/apps/armanfit-admin' run prisma:generate
```
