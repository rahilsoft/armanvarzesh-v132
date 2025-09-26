# OpenTelemetry Setup (Backend)
Install: @opentelemetry/api, @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, @opentelemetry/exporter-trace-otlp-http
Bootstrap before Nest app creation; export to OTLP collector (Tempo/Collector), metrics scraped by Prometheus; logs to Loki.
