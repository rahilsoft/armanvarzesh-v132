# Operations Guide (Snapshot)

## Environment
- **Backend**
  - `OTEL_SERVICE_NAME`, `SERVICE_VERSION`, `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`
  - `REDIS_URL`
  - `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_FORCE_PATH_STYLE=1`
  - `JWKS_PUBLIC_SET` (e.g., `{"keys":[{...JWK...}]}`)

## Endpoints
- `POST /media/presign` → get pre-signed PUT URL
- `POST /media/confirm` → after client upload; records asset and enqueues processing
- `GET  /metrics` → Prometheus metrics
- `POST /payments/webhook` → payment provider webhooks (idempotent)
- `GET  /.well-known/jwks.json` → JWKS public keys
- `GET  /bff/dashboard?userId=` → aggregate stats for dashboard

## Queues
- `media` (BullMQ): jobs `resize`, `transcode`

## Alerts (Prometheus)
- Load `observability/prometheus/alerts/rules.yml` and adjust thresholds.

