# CI scripts (Codemagic / GitHub Actions)

## What changed
- `ci/prisma_generate.sh`: finds your Prisma `schema.prisma` automatically under `apps/backend/**` and runs `prisma generate`. No more hard-coded path.
- `ci/build_backend_with_dlx.sh`: builds the backend with Nest CLI + SWC **from inside** `apps/backend` and makes sure `@swc/core` and `@swc/cli` are present (installed with `--ignore-scripts` so your workspace `postinstall` won't run).

## How to use (Codemagic steps)
1. Add this repo's `ci/` directory at the repo root and commit.
2. In your Codemagic workflow steps:
   ```bash
   bash ci/prisma_generate.sh
   bash ci/build_backend_with_dlx.sh
   ```
3. Make sure `DATABASE_URL` is set in Codemagic Secrets/Env.

## Notes
- These scripts never assume a fixed schema path and won't break if you move your Prisma folder.
- If you still want TypeScript type-checking, set env `TYPECHECK=true` before calling `build_backend_with_dlx.sh`.
