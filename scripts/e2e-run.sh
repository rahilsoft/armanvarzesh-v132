#!/usr/bin/env bash
set -euo pipefail

# Requires: Postgres up (see docker-compose.dev.yml) and prisma migrations applied for each service.
# Usage:
#   docker compose -f "docker-compose.dev.yml" up -d postgres
#   pnpm -r run prisma:migrate:dev   # once
#   ./scripts/e2e-run.sh

echo "→ Auth Service E2E"
pnpm --filter "./services/auth-service" test:e2e

echo "→ Workouts Service E2E"
pnpm --filter "./services/workouts-service" test:e2e

echo "→ Notifications Service E2E"
pnpm --filter "./services/notifications-service" test:e2e

echo "✓ All E2E suites completed."
