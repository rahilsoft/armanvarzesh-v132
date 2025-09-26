#!/usr/bin/env bash
set -euo pipefail
API_BASE="${API_BASE_URL:-http://localhost:4000}"
WEB_BASE="${WEB_BASE_URL:-http://localhost:3000}"

echo "[i] Checking backend health: $API_BASE/healthz"
curl -fsS "$API_BASE/healthz" >/dev/null && echo "[ok] backend /healthz" || (echo "[warn] backend health failed" && exit 1)

echo "[i] Checking web home: $WEB_BASE/"
curl -fsS "$WEB_BASE/" >/dev/null && echo "[ok] web /" || (echo "[warn] web home failed" && exit 1)
