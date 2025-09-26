#!/usr/bin/env bash
set -euo pipefail
# Generate Kubernetes Secret manifest from .env-style inputs
# Usage: ./scripts/rotate_secrets.sh <namespace> <secret-name> ./.env.prod
NS="${1:-default}"
NAME="${2:-arman-secrets}"
ENV_FILE="${3:-.env}"
if [ ! -f "$ENV_FILE" ]; then
  echo "Env file $ENV_FILE not found" >&2
  exit 1
fi
echo "apiVersion: v1
kind: Secret
metadata:
  name: ${NAME}
  namespace: ${NS}
type: Opaque
data:"
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  printf "  %s: %s\n" "$key" "$(printf "%s" "$value" | base64)"
done < "$ENV_FILE"
