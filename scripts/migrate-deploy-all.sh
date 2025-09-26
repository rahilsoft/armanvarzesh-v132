#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
echo "→ Generating Prisma clients..."
pnpm -r --filter "./services/*" run prisma:generate
echo "→ Deploying Prisma migrations..."
pnpm -r --filter "./services/*" run prisma:migrate:deploy
echo "✓ All migrations deployed."
