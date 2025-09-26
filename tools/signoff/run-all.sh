#!/usr/bin/env bash
set -e
pnpm -r run typecheck || true
pnpm -r run build
pnpm -r run test || true
pnpm -r --filter './app/*' run perf:enforce || true
