#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo ">> Scanning for prisma schemas..."
mapfile -t SCHEMAS < <(find "$ROOT_DIR" -name schema.prisma)

for schema in "${SCHEMAS[@]}"; do
  PKG_DIR="$(dirname "$schema")"
  echo ""
  echo "=== $PKG_DIR ==="
  pushd "$PKG_DIR" >/dev/null
  if command -v pnpm >/dev/null 2>&1; then
    pnpm dlx prisma generate --schema=./schema.prisma || true
    pnpm dlx prisma migrate deploy --schema=./schema.prisma || true
  else
    npx prisma generate --schema=./schema.prisma || true
    npx prisma migrate deploy --schema=./schema.prisma || true
  fi
  popd >/dev/null
done

echo ""
echo ">> All prisma 'generate' and 'migrate deploy' attempted."
