#!/usr/bin/env bash
# Prepare offline cache bundle on a machine with internet.
set -euo pipefail

PNPM_VERSION="${PNPM_VERSION:-9}"
corepack enable >/dev/null 2>&1 || true
corepack prepare "pnpm@${PNPM_VERSION}" --activate

pnpm -w install --frozen-lockfile || pnpm -w install --no-frozen-lockfile

STORE_DIR="$(pnpm store path)"
echo "[i] pnpm store: ${STORE_DIR}"
tar -czf offline_store.tgz -C "${STORE_DIR}" .

mkdir -p offline_packages
pnpm pack --recursive --pack-destination offline_packages || true

echo "[ok] Created offline_store.tgz and offline_packages/"
