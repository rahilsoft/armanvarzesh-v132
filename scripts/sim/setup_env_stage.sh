#!/usr/bin/env bash
set -euo pipefail
cp -f Unified_.env.example .env.staging
sed -i.bak 's#http://localhost:3000#https://staging.armanvarzesh.com#g' .env.staging || true
sed -i.bak 's#http://localhost:4000#https://api-staging.armanvarzesh.com#g' .env.staging || true
sed -i.bak 's#ws://localhost:4000#wss://api-staging.armanvarzesh.com#g' .env.staging || true
echo "NODE_ENV=staging" >> .env.staging
echo "CORS_ALLOWED_ORIGINS=https://staging.armanvarzesh.com" >> .env.staging
echo "DATA_DIR=/var/opt/armanvarzesh" >> .env.staging
echo "[ok] Wrote .env.staging"
