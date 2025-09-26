#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root based on this script's location
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Using ROOT_DIR: $ROOT_DIR"

# --- Tooling ---
echo "==> Enable Corepack and set pnpm@10"
corepack enable || true
corepack use pnpm@10.0.0
node -v && pnpm -v

# --- Install workspace (at root) ---
echo "==> Installing workspace dependencies"
cd "$ROOT_DIR"
pnpm install --frozen-lockfile=false

# --- Prisma generate (backend) ---
echo "==> Running Prisma generate for apps/backend"
# Provide a safe default DATABASE_URL if not set (Codemagic secrets can override this)
export DATABASE_URL="${DATABASE_URL:-postgresql://user:pass@localhost:5432/arman?schema=public}"
pnpm --filter ./app/backend exec prisma generate --schema ./src/database/prisma/schema.prisma

# --- Build backend with Nest CLI via pnpm dlx (no global install) ---
echo "==> Building backend with Nest CLI (SWC + type-check)"
cd "$ROOT_DIR/apps/backend"
pnpm dlx -y @nestjs/cli@10.4.5 build -b swc --type-check

echo "==> Build finished. Artifacts are in apps/backend/dist"
