# Phase 3 — Implementation Report (2025-08-15)

**Delivered**
- Request-scoped **DataLoaders** via `LoadersFactory` + `LoadersInterceptor` (usersById, workoutsById examples)
- **AppModule** patched to register `LoadersInterceptor`, `LoadersFactory`, `InfraModule`, `MediaUploadModule`, `MetricsModule`, and `ScheduleModule`
- **OTEL NodeSDK** bootstrap (`app/backend/src/otel/bootstrap.ts`) and auto-instrumentations hook
- **Prometheus /metrics** endpoint (`MetricsModule`) with default process metrics
- **Media schema** (`db/migrations/2025-08-15_media_assets.sql`) and **MediaService** to enqueue BullMQ jobs
- **Payments reconciliation** scaffold with hourly Cron job

**Notes**
- Loaders assume Prisma models `user` and `workout`; adjust to your exact schema.
- Ensure `prom-client`, OTEL deps, `bullmq` exist in backend deps; `pnpm install` will fetch.
- Consider moving queue/redis config to `ConfigModule`.

**Next (Phase 4)**
- Wire media upload callback → insert `media_assets` row → **Outbox** event → `media-worker` transcode
- Add OTEL resource attributes and proper exporter endpoints via env
- Add real reconciliation logic (provider SDK) + idempotent outbox events
