# Service Hardening Report

**Service Path:** `armanvarzesh_v41/apps/backend`  
**Timestamp:** 2025-08-19T06:19:30.300287Z

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
