#!/usr/bin/env bash
set -euo pipefail
export DATABASE_URL="${DATABASE_URL:-}"
if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi
pnpm --filter ./app/backend exec prisma generate
pnpm --filter ./app/backend exec prisma migrate deploy
echo "Prisma migrate deploy completed."
