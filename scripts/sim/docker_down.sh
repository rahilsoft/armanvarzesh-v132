#!/usr/bin/env bash
set -euo pipefail
echo "[i] Stopping services..."
docker compose down -v
echo "[ok] Services stopped and volumes removed."
