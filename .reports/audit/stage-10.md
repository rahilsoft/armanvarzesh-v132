# Stage 10 — Performance Audit

**Source of truth:** repository only.

---

## Findings

### P0-01 — Connection-pool exhaustion by design (86 `new PrismaClient()`)
**Evidence:** Stage 03 P1-01 / Stage 06 P1-02. Multiple clients per process (`payments.service.ts:13`, plus `prisma.readiness.ts` `new PrismaClient()`, plus each seed).
**Why it is a problem:** Each client = a pool (default ~ `num_cpus*2+1`). With N services × M clients × R replicas, total connections quickly exceed Postgres `max_connections` (typically 100–500). At millions of users with autoscaling, this is the first thing to break.
**Production impact:** DB connection refusal, cascading 5xx, inability to scale horizontally.
**Recommended fix:** Single shared `PrismaService`; add PgBouncer.
**Effort:** M. **Risk:** Critical.

### P1-02 — Synchronous `execSync` blocking the event loop in request/worker paths
**Evidence:** `services/content-service/src/plan/plan.resolver.ts:321,328` call `execSync(ffprobe/ffmpeg)` **inside a GraphQL mutation resolver** (`processExerciseMedia`). `media.worker.ts:50,57` likewise.
**Why it is a problem:** `execSync` blocks the Node event loop for the entire duration of ffmpeg/ffprobe (seconds). In the resolver path this stalls **all** concurrent requests on that process.
**Production impact:** Head-of-line blocking; p99 latency spikes; effective single-threaded stall during transcode.
**Recommended fix:** Move to the async worker/queue only; use async `spawn`.
**Effort:** M. **Risk:** High.

### P1-03 — Unbounded queries / missing pagination
**Evidence:** Stage 09 P2-04; list reads without `take`/`skip`. Missing indexes cannot be verified because migrations don't exist (Stage 04 P0-01) — so index coverage is **NOT VERIFIED** and must be assumed absent.
**Why it is a problem:** Full-table scans + full-table returns.
**Production impact:** Latency and memory blowups; DB CPU saturation.
**Recommended fix:** Pagination + explicit `@@index` in schemas + verify with `EXPLAIN`.
**Effort:** M. **Risk:** High.

### P2-04 — Synchronous file I/O in hot paths
**Evidence:** `media.worker.ts:46 fs.writeFileSync(tmpVideo, buf)`, `:60 fs.existsSync`, `:63 fs.readFileSync(thumb)`; `plan.resolver.ts` same pattern.
**Why it is a problem:** `*Sync` fs calls block the event loop; combined with `execSync` the resolver is fully blocking.
**Production impact:** Throughput collapse under concurrent media jobs.
**Recommended fix:** `fs/promises`; stream to S3.
**Effort:** S. **Risk:** Medium.

### P2-05 — In-memory PubSub and in-process rate limiting don't scale horizontally
**Evidence:** GraphQL `PubSub` in-memory (Stage 08 P3-05); `express-rate-limit` default memory store (`packages/security-middleware/src/index.ts:47`, `userRateLimit.ts:16`) — no Redis store configured.
**Why it is a problem:** Per-pod rate-limit counters mean the effective limit = configured × replica count; attacker throughput scales with your autoscaling. PubSub doesn't fan out.
**Production impact:** Rate limiting ineffective at scale; broken subscriptions.
**Recommended fix:** Redis-backed rate-limit store + PubSub.
**Effort:** M. **Risk:** Medium.

---

## Positives (verified)
- Redis is available in the stack (`ioredis`/`createClient` in 10 files; `docker-compose.redis.yml`); BullMQ worker in `services/content-service/src/jobs/media.worker.ts` (queue offload exists for media).
- Prometheus metrics widespread (108 refs) enable hotspot detection.

## Stage score: **35/100** (Performance)
