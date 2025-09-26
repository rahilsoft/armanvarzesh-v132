#!/usr/bin/env bash
set -euo pipefail
# Stage 38 — SBOM via syft (requires syft)
IMAGE=${1:-armanfit/app:latest}
syft $IMAGE -o spdx-json > sbom.spdx.json
