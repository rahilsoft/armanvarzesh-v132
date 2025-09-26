#!/usr/bin/env bash
set -euo pipefail

# Install CLI locally to avoid dlx/network variance
pnpm -w add -D @nestjs/cli@10.4.5

cd apps/backend
# Use npx from pnpm workspace bin
if [ "${1:-}" = "--type-check" ]; then
  pnpm nest build -b swc --type-check
else
  pnpm nest build -b swc
fi
cd -
