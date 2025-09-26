#!/usr/bin/env bash
set -euo pipefail
corepack enable
corepack use pnpm@10.0.0
node -v && pnpm -v
