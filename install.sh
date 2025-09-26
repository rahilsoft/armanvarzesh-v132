#!/usr/bin/env bash
set -euo pipefail
echo "==> Installing workspace with pnpm 9, Node 20"
corepack enable
corepack prepare pnpm@9.6.0 --activate
pnpm -w install --frozen-lockfile
echo "==> Bootstrapped successfully."
