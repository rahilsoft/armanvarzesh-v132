# Observability Notes
- Metrics via prom-client; export /metrics endpoint behind auth in prod.
- Suggested: adopt OpenTelemetry SDK for traces and metrics with service.name tags and domain labels (payment_id, reservation_id).
- Log correlation: include request-id and user-id in pino logs.


## Tracing — Phase 2 (NodeSDK Full)
- فعال‌سازی خودکار در صورت تنظیم یکی از این‌ها:
  - `OTEL_TRACES_ENABLED=true|1`
  - یا `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318/v1/traces`
- تنظیمات اختیاری:
  - `OTEL_EXPORTER_OTLP_HEADERS="authorization=Bearer xyz,tenant=abc"`
  - `OTEL_SERVICE_NAME`، `OTEL_SERVICE_VERSION`، `OTEL_ENVIRONMENT`
- Auto-instrumentations: HTTP/Express/GraphQL/Postgres/Redis (با نادیده‌گرفتن `/metrics`).
