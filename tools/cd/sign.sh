#!/usr/bin/env bash
set -euo pipefail
# Stage 38 — Cosign sign (requires COSIGN_* env)
IMAGE=${1:-armanfit/app:latest}
cosign sign --key $COSIGN_KEY $IMAGE
