#!/usr/bin/env bash
set -euo pipefail

echo ">>> ArmanVarzesh Monorepo — Local Build Script"
echo "Node: $(node -v || true)"
echo "pnpm: $(pnpm -v || true)"

# Ensure pnpm via corepack
if ! command -v pnpm >/dev/null 2>&1; then
  echo "Enabling pnpm via corepack..."
  corepack enable || true
  corepack prepare pnpm@10.0.0 --activate
fi

echo ">>> Install (workspace, frozen lockfile)"
pnpm -w install --frozen-lockfile

# Prisma generate (workspace)
export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/arman?schema=public}"
echo "DATABASE_URL=${DATABASE_URL}"
pnpm -r --filter "./**" exec bash -lc 'if [ -f prisma/schema.prisma ] || [ -f ./src/database/prisma/schema.prisma ]; then echo "Generating Prisma in $PWD"; pnpm dlx prisma generate; fi'

echo ">>> Lint (soft-fail)"
pnpm -w run lint || true

echo ">>> Typecheck (soft-fail)"
pnpm -w run typecheck || true

echo ">>> Build"
pnpm -w run build

echo ">>> Test (soft-fail if no tests)"
pnpm -w run test || true

echo ">>> Done."
