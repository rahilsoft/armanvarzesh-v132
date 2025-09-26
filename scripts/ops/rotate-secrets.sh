
#!/usr/bin/env bash
set -euo pipefail
NS="${1:-default}"
NAME="${2:-api-gateway}"
KEY="${3:-JWT_SECRET}"
VAL="${4:-}"
if [[ -z "$VAL" ]]; then echo "Usage: rotate-secrets <ns> <name> <KEY> <VAL>"; exit 1; fi
kubectl -n "$NS" create secret generic "$NAME" --from-literal="$KEY=$VAL" --dry-run=client -o yaml > secret.yaml
kubeseal --format yaml < secret.yaml > sealed-"$NAME".yaml
echo "Sealed secret created: sealed-$NAME.yaml (commit & apply)"
