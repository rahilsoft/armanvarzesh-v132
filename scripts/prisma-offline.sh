#!/usr/bin/env bash
# Regenerate a Prisma client fully offline using engines already cached in the
# pnpm store (the sandbox blocks the engine download that `prisma generate`
# otherwise attempts). Usage: scripts/prisma-offline.sh <path/to/schema.prisma>
set -euo pipefail
ENGINES="$(ls -d node_modules/.pnpm/@prisma+engines@*/node_modules/@prisma/engines | head -1)"
PRISMA="$(ls node_modules/.pnpm/prisma@*/node_modules/prisma/build/index.js | head -1)"
export PRISMA_QUERY_ENGINE_LIBRARY="$PWD/$ENGINES/libquery_engine-debian-openssl-3.0.x.so.node"
export PRISMA_SCHEMA_ENGINE_BINARY="$PWD/$ENGINES/schema-engine-debian-openssl-3.0.x"
export PRISMA_CLI_QUERY_ENGINE_TYPE=library
export PRISMA_ENGINES_MIRROR="file://$PWD/$ENGINES"
export CHECKPOINT_DISABLE=1 PRISMA_DISABLE_WARNINGS=1
node "$PRISMA" generate --schema "$1"
