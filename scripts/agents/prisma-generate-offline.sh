#!/usr/bin/env sh
# Generate the Prisma client in sandboxes that cannot reach binaries.prisma.sh.
# Uses placeholder engine paths: enough for TypeScript types, typecheck and unit tests.
# NOT for runtime / e2e against a real DB — those need real engines (run them on CI).
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FAKE="${TMPDIR:-/tmp}/prisma-fake-engines"
mkdir -p "$FAKE"
touch "$FAKE/libquery_engine.so.node" "$FAKE/schema-engine"
chmod +x "$FAKE/schema-engine"
cd "$ROOT/app/backend"
PRISMA_QUERY_ENGINE_LIBRARY="$FAKE/libquery_engine.so.node" \
PRISMA_SCHEMA_ENGINE_BINARY="$FAKE/schema-engine" \
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 \
npx prisma generate --schema src/database/prisma/schema.prisma
