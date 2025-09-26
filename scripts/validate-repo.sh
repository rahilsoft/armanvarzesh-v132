
#!/usr/bin/env bash
set -euo pipefail
echo "Checking workspace..."
test -d services/api-gateway || (echo "Missing api-gateway" && exit 2)
test -d contracts || (echo "Missing contracts" && exit 2)
test -d deploy/helm || (echo "Missing helm" && exit 2)
test -d observability || (echo "Missing observability" && exit 2)
echo "OK"
