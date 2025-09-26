#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(pwd)"
BACKEND_DIR="apps/backend"
NEST_CLI_VER="${NEST_CLI_VER:-10.4.5}"
SWC_CORE_VER="${SWC_CORE_VER:-1.7.26}"
SWC_CLI_VER="${SWC_CLI_VER:-0.3.12}"
TYPE_CHECK="${TYPE_CHECK:-false}"

echo "ℹ️  Backend build starting"
echo "    ROOT_DIR:        ${ROOT_DIR}"
echo "    BACKEND_DIR:     ${BACKEND_DIR}"
echo "    Nest CLI:        @nestjs/cli@${NEST_CLI_VER}"
echo "    SWC core/cli:    @swc/core@${SWC_CORE_VER}, @swc/cli@${SWC_CLI_VER}"
echo "    Type-check:      ${TYPE_CHECK}"

echo "ℹ️  Installing workspace dependencies (pnpm install --ignore-scripts)"
pnpm install --ignore-scripts

echo "ℹ️  Ensuring SWC deps exist in ${BACKEND_DIR} (no scripts)"
pnpm --filter ./${BACKEND_DIR} add -D @swc/core@${SWC_CORE_VER} @swc/cli@${SWC_CLI_VER} --ignore-scripts

echo "ℹ️  Building backend with Nest CLI via pnpm dlx"
cd "${BACKEND_DIR}"
pnpm dlx @nestjs/cli@${NEST_CLI_VER} --version >/dev/null
if [[ "${TYPE_CHECK}" == "true" ]]; then
  pnpm dlx @nestjs/cli@${NEST_CLI_VER} build -b swc --type-check
else
  pnpm dlx @nestjs/cli@${NEST_CLI_VER} build -b swc
fi
cd - >/dev/null
