# Phase 1 Changes – 2025-08-18T13:22:15.140513Z

- Prisma: schemas touched: 6; total indexes added: 36
- Added packages:
  - @arman/resilience (HTTP retry/backoff + circuit breaker skeleton; MessageBus contract)
  - @arman/cache-std (Key namespacing + TTLs)
  - @arman/observability (OpenTelemetry bootstrap helper)
- Added ADRs: ADR-001 Comms, ADR-002 Cache, ADR-003 Observability, ADR-004 HA
- Updated docs/ARCHITECTURE.md (summary of decisions)

NOTE: Composite index [status, createdAt] added only when both fields existed and were not already indexed.
