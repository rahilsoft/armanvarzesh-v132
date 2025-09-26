#!/usr/bin/env bash
set -euo pipefail
BASE_URL=${1:-http://localhost:3000}
k6 run loadtests/graphql_smoke.js --env BASE_URL=$BASE_URL
