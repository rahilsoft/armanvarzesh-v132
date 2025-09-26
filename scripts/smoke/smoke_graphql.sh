#!/usr/bin/env bash
set -euo pipefail
API_BASE="${API_BASE_URL:-http://localhost:4000}"
echo "[i] GraphQL sanity check (expect 200/400 class response)"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json"   -d '{"query":"query { __typename }"}'   "$API_BASE/graphql")
echo "[i] /graphql returned HTTP $HTTP_CODE"
if [[ "$HTTP_CODE" =~ ^2|3|4 ]]; then
  echo "[ok] graphql endpoint responsive (HTTP $HTTP_CODE)"
else
  echo "[warn] graphql endpoint not responsive (HTTP $HTTP_CODE)"; exit 1
fi
