#!/usr/bin/env bash
set -euo pipefail
cp -f Unified_.env.example .env.production
sed -i.bak 's/development/production/g' .env.production || true
sed -i.bak 's#http://localhost:3000#https://www.armanvarzesh.com#g' .env.production || true
sed -i.bak 's#http://localhost:4000#https://api.armanvarzesh.com#g' .env.production || true
sed -i.bak 's#ws://localhost:4000#wss://api.armanvarzesh.com#g' .env.production || true
echo "NODE_ENV=production" >> .env.production
echo "CORS_ALLOWED_ORIGINS=https://www.armanvarzesh.com,https://admin.armanvarzesh.com" >> .env.production
echo "DATA_DIR=/var/opt/armanvarzesh" >> .env.production
echo "[ok] Wrote .env.production"
