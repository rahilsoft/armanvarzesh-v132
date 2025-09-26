#!/usr/bin/env bash
set -euo pipefail
echo '[Stage 15] Generating INIT.sql from schema.prisma'
npx prisma migrate diff --from-empty --to-schema=./schema.prisma --script > ./migrations/INIT.sql
echo '[Stage 15] Marking migration as applied (dev)'
echo 'Use: npx prisma migrate resolve --applied 0_init'
