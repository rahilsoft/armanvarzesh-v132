#!/usr/bin/env bash
set -euo pipefail
echo "==> Installing workspace with pnpm 10, Node 20"
corepack enable
corepack use pnpm@10.x
pnpm -w install --frozen-lockfile
echo "==> Bootstrapped successfully."
