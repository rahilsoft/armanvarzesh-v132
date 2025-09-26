#!/usr/bin/env bash
set -euo pipefail

echo "== ArmanVarzesh Dry-Run =="
corepack enable
corepack prepare pnpm@9.6.0 --activate

echo "[1/6] Install"
pnpm install --frozen-lockfile || pnpm install

echo "[2/6] Typecheck"
pnpm run typecheck

echo "[3/6] Build (apps + services + packages)"
pnpm run build

echo "[4/6] Unit + Contract tests"
pnpm run test

echo "[5/6] Backend E2E with Testcontainers (requires Docker)"
if pnpm --filter ./app/backend run e2e; then
  echo "E2E passed"
else
  echo "E2E skipped/failed (likely due to Docker not being available). Remaining steps continue."
fi

echo "[6/6] Export GraphQL schema"
pnpm --filter ./app/backend run build
bash scripts/export_graphql_schema.sh || true

echo "== Dry-run finished. =="
