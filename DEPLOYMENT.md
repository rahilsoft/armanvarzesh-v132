# Deployment / Infra

## One-liners
```bash
# Build & run all (db + services)
docker compose up -d --build

# Tail logs
docker compose logs -f --tail=200

# Run smoke tests
./scripts/smoke.sh
```

## Services & Ports
- activities: :4075
- chat: :4077
- notifications: :4079
- payments: :4081
- bff: :4091
- coach: :4093
- postgres: :5432

All services use UTC time; presentational TZ handled in clients.

## Health
Compose uses container health for db; app services rely on process status + port listen (can be extended with /health endpoints via Nest Terminus).

## Observability
Each service imports `@arman/observability-sdk/register` (wiring point for OTel tracer/metrics). Add your OTEL exporter config via env vars, e.g.:
```
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_SERVICE_NAME=activities-service
```
