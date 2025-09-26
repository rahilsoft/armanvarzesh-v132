#!/usr/bin/env bash
set -euo pipefail

echo "ℹ️  Using DATABASE_URL for prisma generate (redacted)"
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: Required secret DATABASE_URL is not set"
  exit 1
fi

# default path expected by workflow
DEFAULT_PATH="apps/backend/src/database/prisma/schema.prisma"

discover_schema() {
  local p
  # 1) exact default
  if [[ -f "$DEFAULT_PATH" ]]; then
    echo "$DEFAULT_PATH"; return 0
  fi
  # 2) common alternates in backend
  for p in     "apps/backend/src/prisma/schema.prisma"     "apps/backend/prisma/schema.prisma"     "apps/backend/src/database/prisma/schema.prisma"
  do
    if [[ -f "$p" ]]; then echo "$p"; return 0; fi
  done
  # 3) generic discovery under apps/**/prisma/schema.prisma
  p="$(find apps -type f -path '*/prisma/schema.prisma' -print -quit || true)"
  if [[ -n "${p:-}" && -f "$p" ]]; then echo "$p"; return 0; fi
  return 1
}

SCHEMA_PATH="$(discover_schema || true)"

if [[ -z "${SCHEMA_PATH:-}" ]]; then
  echo "Error: Could not load \`--schema\` from provided path \`${DEFAULT_PATH}\`: file or directory not found"
  exit 1
fi

echo "ℹ️  prisma schema: ${SCHEMA_PATH}"
pnpm --filter ./app/backend exec prisma generate --schema "${SCHEMA_PATH}"
