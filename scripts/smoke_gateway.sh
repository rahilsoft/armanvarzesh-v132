#!/usr/bin/env bash
set -euo pipefail
echo "[GW] Hitting BFF via gateway"
curl -sS http://localhost:8080/bff/graphql -H 'content-type: application/json' -d '{"query":"{ dashboardBundle { warnings } }"}' | jq
echo "[GW] Hitting payments via gateway"
curl -sS http://localhost:8080/payments/payments/seed -XPOST | jq
