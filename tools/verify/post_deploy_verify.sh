#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://localhost:3000}"
FILE="tests/api-smoke/smoke-endpoints.json"
if [ ! -f "$FILE" ]; then
  echo "Endpoints file not found: $FILE"; exit 1
fi
pass=0; fail=0
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
done < /dev/null
JQ=$(command -v jq || true)
if [ -z "$JQ" ]; then echo "jq is required"; exit 1; fi
for ep in $(jq -r '.[]' "$FILE"); do
  [[ "$ep" == "null" ]] && continue
  if [[ "$ep" == http* ]]; then
    url="$ep"
  else
    url="$BASE$ep"
  fi
  code=$(curl -sk -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [[ "$code" =~ ^(200|204|400|401|403|404)$ ]]; then
    echo "[PASS] $code $url"; pass=$((pass+1))
  else
    echo "[FAIL] $code $url"; fail=$((fail+1))
  fi
done
echo "Summary: PASS=$pass FAIL=$fail"
[[ $fail -eq 0 ]]
