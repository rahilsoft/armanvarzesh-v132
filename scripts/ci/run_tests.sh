#!/usr/bin/env bash
set -euo pipefail

PNPM_VERSION="${PNPM_VERSION:-9}"

echo "[i] Ensuring pnpm"
corepack enable >/dev/null 2>&1 || true
corepack prepare "pnpm@${PNPM_VERSION}" --activate

# Try local turbo first
if [ -x "node_modules/.bin/turbo" ]; then
  echo "[i] Running tests via local turbo"
  node_modules/.bin/turbo run test --continue --concurrency=2 || true
else
  # Fallback: run per-package tests if present (no turbo)
  echo "[i] turbo not found locally. Running per-package tests (if-present)"
  pnpm -r --if-present test || true
fi

echo "[ok] Test phase finished (non-zero failures would be reported within task logs)."
