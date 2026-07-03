# Stage 14 — Production Readiness

**Source of truth:** repository only. Each question answered from evidence in Stages 01–13.

---

### Can this repository be deployed today?
**NO.** Blockers:
- Migrations are absent for 20/25 schemas; deploy script falls back to `prisma db push` which can drop data (Stage 04 P0-01/P1-02).
- Deploy topology is ambiguous (monolith `app/backend` vs 34 `services/*`) (Stage 02 P1-01).
- Lockfile self-declared non-authoritative (Stage 13 P1-01).

### Can this survive production traffic (functional correctness)?
**NO.** The `services/payments-service` webhook processes money in 4 un-transacted writes (Stage 03 P1-02) and emits to an outbox nothing drains (Stage 02 P1-05) → paid users may never get entitlements, and crashes leave inconsistent financial state.

### Can it survive millions of users (scale)?
**NO.** 86 `new PrismaClient()` instances guarantee connection-pool exhaustion (Stage 10 P0-01). In-memory rate limiting and PubSub don't scale horizontally (Stage 10 P2-05). Unbounded queries with unverifiable indexes (Stage 04/10).

### Can it survive malicious users (security)?
**NO.** Four P0s: header-trust auth bypass / IDOR / privilege escalation (Stage 05 P0-01), optional JWT secret (P0-02), hardcoded `'dev'`/`'change_me'` fallback secrets (P0-03), and an unsigned payment webhook granting free entitlements (P0-04). Plus SSRF + `execSync` command surface (P1-05).

### Can it survive node crashes?
**PARTIAL / NO.** Un-transacted multi-write money flows (Stage 03 P1-02) and a non-draining outbox (Stage 02 P1-05) mean a crash mid-flow corrupts state. Inline `new PrismaClient()` has no `OnModuleDestroy` → no graceful `$disconnect` (Stage 06 P1-02).

### Can it survive database failover?
**NOT VERIFIED / LIKELY NO.** No PgBouncer/connection-manager evidence; each service holds its own pools. Terraform provisions RDS (`infra/terraform/modules/rds`) but no read-replica/failover handling in app code was found. Retry/backoff exists only in `app/backend` notification providers, not DB access.

### Can it survive container restarts?
**PARTIAL.** Health/readiness endpoints exist broadly (Stage 06, 115 refs) and the gateway has `/ready` gating on subgraph load — good for orchestrated restarts. But in-memory state (PubSub, rate-limit counters, local `uploads/` temp files in media paths) is lost on restart and not externalized.

### Can it survive network partitions?
**NO.** Outbound `fetch` calls lack timeouts/circuit breakers in `services/*` (Stage 09 P3-05). Federation gateway uses runtime `IntrospectAndCompose` — a partition to any subgraph at boot prevents gateway startup (Stage 08 P1-02). In-memory PubSub loses cross-pod delivery under partition.

---

## Verdict
The repository is **NOT production-ready**. It cannot be safely deployed, cannot correctly process payments, cannot scale horizontally, and is trivially exploitable by an unauthenticated attacker. Multiple independent P0s each individually block release.

## Stage score: **20/100** (Production Readiness)
