#!/usr/bin/env bash
set -euo pipefail

echo "[local-build] Using Node via .nvmrc if available..."
if command -v nvm >/dev/null 2>&1; then
  nvm use || true
fi

echo "[local-build] Enable Corepack & use pnpm@9.6.0"
corepack enable || true
corepack use pnpm@9.6.0

echo "[local-build] Install workspace dependencies (lockfile-aware)"
pnpm -w i

echo "[local-build] Run Prisma migrations (deploy)"
pnpm -C apps/backend prisma migrate deploy || true

echo "[local-build] Build backend + vitrin-site"
pnpm -C apps/backend build
pnpm -C apps/vitrin-site build

echo "[local-build] Done. Start services:"
echo "  - Backend: pnpm -C apps/backend start:prod"
echo "  - Vitrin : pnpm -C apps/vitrin-site start"
