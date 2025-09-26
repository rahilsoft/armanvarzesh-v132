#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
echo "→ Generating Prisma clients..."
pnpm -r --filter "./services/*" run prisma:generate
echo "→ Running Prisma migrate dev (init) for all services..."
pnpm -r --filter "./services/*" run prisma:migrate:dev
echo "✓ All migrations (dev) executed."
