#!/usr/bin/env bash
set -e
BASE=${1:-http://localhost:3000}
set +e
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/health"
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/metrics"
set -e
