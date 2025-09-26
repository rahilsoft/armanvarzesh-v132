#!/usr/bin/env bash
set -euo pipefail
echo "[i] Building and starting services (db, redis, minio, backend, vitrin)..."
docker compose up -d --build
echo "[ok] Services started. Waiting for healthchecks..."
sleep 10
docker compose ps
