#!/usr/bin/env bash
set -euxo pipefail
# Remove a non-existent package if it leaks into package.json
# (some templates mistakenly add @nestjs/swc which doesn't exist on npm)
pnpm remove @nestjs/swc --filter ./app/backend || true
