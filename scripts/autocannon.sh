
#!/usr/bin/env bash
set -euo pipefail
URL="${1:-http://localhost:8080/v1/habits/today}"
npx autocannon -d 30 -c 50 "$URL"
