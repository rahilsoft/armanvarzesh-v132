# Dependency version harmonization

The following changes were applied automatically:

## OpenTelemetry family
- `@opentelemetry/auto-instrumentations-node` → `^0.53.0` (if present)
- `@opentelemetry/sdk-node` → `^0.53.0` (if present)
- `@opentelemetry/exporter-trace-otlp-http` → `^0.53.0` (if present)
- `@opentelemetry/api` → `^1.8.0` (if present)
- `@opentelemetry/resources` → `^1.8.0` (if present)
- `@opentelemetry/semantic-conventions` → `^1.23.0` (if present)

## argon2
- `argon2` → `^0.41.1` (if present)

## Root settings
- `engines.node` ensured to be `>=18`
- `packageManager` set to `bun@1.1.21`

## Updated files
- package.json
- apps/backend/package.json
- services/predictive-service/package.json
- services/ai-service/package.json
- services/vip-service/package.json
- services/nutrition-service/package.json
- services/reward-service/package.json
- services/chat-service/package.json
- services/marketplace-service/package.json
- services/assessment-service/package.json
- services/monitoring-service/package.json
- services/coaches-service/package.json
- services/auth-service/package.json
- services/content-service/package.json
- services/challenges-service/package.json
- services/courses-service/package.json
- services/users-service/package.json
- services/affiliate-service/package.json
