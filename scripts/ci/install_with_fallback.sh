#!/usr/bin/env bash
set -euo pipefail

PNPM_VERSION="${PNPM_VERSION:-9}"
REGISTRY_URL="${REGISTRY_URL:-}"
HTTP_PROXY="${HTTP_PROXY:-${http_proxy:-}}"
HTTPS_PROXY="${HTTPS_PROXY:-${https_proxy:-}}"

echo "[i] Using pnpm v${PNPM_VERSION}"
corepack enable >/dev/null 2>&1 || true
corepack prepare "pnpm@${PNPM_VERSION}" --activate
pnpm -v

# Use local store for caching
pnpm config set store-dir .pnpm-store

# Apply registry/proxy if provided
if [ -n "${REGISTRY_URL}" ]; then
  echo "[i] Setting npm registry to ${REGISTRY_URL}"
  npm config set registry "${REGISTRY_URL}"
  pnpm config set registry "${REGISTRY_URL}"
fi
if [ -n "${HTTP_PROXY}" ]; then npm config set proxy "${HTTP_PROXY}"; fi
if [ -n "${HTTPS_PROXY}" ]; then npm config set https-proxy "${HTTPS_PROXY}"; fi

# Install
if [ -f pnpm-lock.yaml ]; then
  echo "[i] Trying frozen install..."
  if pnpm -w install --frozen-lockfile; then exit 0; fi
  echo "[warn] Frozen install failed; trying prefer-offline..."
  if pnpm -w install --no-frozen-lockfile --prefer-offline; then exit 0; fi
else
  echo "[warn] No lockfile; trying non-frozen install..."
  if pnpm -w install --no-frozen-lockfile; then exit 0; fi
fi

# Offline fallback (requires cache from previous build)
if [ -d ".pnpm-store" ]; then
  echo "[i] Attempting offline install from local store"
  if pnpm -w install --offline; then exit 0; fi
fi

echo "[err] All install strategies failed"
exit 1
