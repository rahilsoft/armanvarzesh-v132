# ADR-0004: Observability — Metrics & Tracing

## Status
Accepted

## Decision
- Expose Prometheus metrics at `/metrics` and enable default collectors.
- Propagate `x-request-id` for correlation; adopt OpenTelemetry tracing.

## Consequences
- Faster incident triage; measurable SLOs; bottleneck discovery.
