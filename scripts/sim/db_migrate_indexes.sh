#!/usr/bin/env bash
set -euo pipefail
if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/armanvarzesh"
fi
echo "[i] Applying DB index migration from db/DB_Migrations_Indexes.sql to $DATABASE_URL"
psql "$DATABASE_URL" -f db/DB_Migrations_Indexes.sql
echo "[ok] DB indexes migration applied."
