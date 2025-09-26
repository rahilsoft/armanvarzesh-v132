# Phase 2 — Implementation Report (2025-08-15)

**Delivered**
- Prisma-backed repositories for Outbox/Idempotency in backend (`app/backend/src/infra/*.prisma.repo.ts` + `InfraModule`)
- GraphQL context type + context now exposes `loaders` (stub) (`app/backend/src/graphql/context.type.ts`, config patched)
- S3/MinIO presigned upload controller (`/media/presign`) + module scaffold
- Preview workflows for web and API (artifacts attached to PR)
- Prometheus alert rules for SLOs/webhooks/queue delay

**How to wire**
1) **AppModule**: import `InfraModule` and `MediaUploadModule` in `imports: []` of backend app.
2) **Resolvers**: inject loaders via `@Context()`; build loaders per-request in a provider (Phase 3 will add a LoaderFactory).
3) **Database**: run SQL migration (`db/migrations/2025-08-15_phase1_outbox_idempotency.sql`).
4) **Env for presign**: `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT` (for MinIO), `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_FORCE_PATH_STYLE=1` (for MinIO).
5) **Prometheus**: include `observability/prometheus/alerts/rules.yml` into your Prom config. Expose metrics from API (Phase 3 will add OTEL/Prom metrics).
6) **GitHub**: open a PR to trigger preview artifacts.

**Next (Phase 3)**
- Request-scoped LoaderFactory wired with PrismaService + retrofitting top resolvers (users/workouts)
- Pre-signed policy/ACLs and media DB schema; event-driven pipeline (Outbox → media-worker)
- OTEL NodeSDK bootstrap + Prom metrics exporter + Loki logger
- Reconciliation job for payments + alerting
