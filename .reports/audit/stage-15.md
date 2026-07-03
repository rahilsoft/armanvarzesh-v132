# Stage 15 — Final Certification

**Repository:** rahilsoft/armanvarzesh-v132
**Audit date:** 2026-07-03
**Method:** Repository-only verification. No previous report, commit, or PR trusted. Every finding cites on-disk evidence. Where proof was impossible, marked **NOT VERIFIED**.

---

## Executive Summary

Arman Varzesh v132 is an ambitious pnpm monorepo (~2,400 TS/TSX files, 34 microservices, 5 GraphQL subgraphs, a parallel NestJS monolith, 3 frontends, Helm/Terraform/K8s, 31 CI workflows). The engineering **breadth** is real: argon2 auth with refresh-token rotation, Prometheus metrics (108 refs), health/readiness endpoints (115 refs), a security-middleware package, SBOM + Trivy/Grype/CodeQL/gitleaks pipelines, and OTEL wiring.

But **depth and correctness do not match the breadth**, and the repository is **NOT certifiable for production**. It carries **six P0 defects**, any one of which blocks release:

1. **Auth bypass via `x-user-id`/`x-role` headers** across 30 files → IDOR, account takeover, self-promotion to admin.
2. **`JWT_SECRET` optional** in every service env schema → services boot without a secret.
3. **Hardcoded fallback secrets** (`'dev'`, `'change_me'`) → trivial token forgery.
4. **Payment webhook has no signature verification** → free entitlements / revenue fraud.
5. **Migrations absent for 20/25 databases** + deploy falls back to `prisma db push` → silent data loss, no rollback.
6. **86 `new PrismaClient()` instances** → connection-pool exhaustion; cannot scale.

Compounding these: a dual monolith/microservice topology with no canonical owner, a non-draining outbox (payments emit events nothing delivers), un-transacted money flows in `services/*`, placeholder/`expect(true)` tests inflating a green CI, a self-declared **non-authoritative lockfile**, and a NestJS 10-vs-11 version skew forced by overrides.

The codebase reads like it has been through many automated "phase" passes that produced **documentation and structure** (dozens of `CHANGES_*`, `STEP*`, `PHASE_*` reports at root) faster than they produced **verified, tested, secure behavior**. Fixes were applied to one topology (`app/backend`) and not its twin (`services/*`).

**Overall grade: F (Not Certified).**

---

## Scorecard

| Dimension | Score /100 | Basis |
|---|---:|---|
| Architecture | 45 | Dual topology, non-draining outbox, federation gaps (Stage 02) |
| Security | 18 | 4× P0 auth/secret/webhook + SSRF/cmd-exec (Stage 05) |
| Performance | 35 | 86 Prisma clients, blocking execSync, unbounded queries (Stage 10) |
| Code Quality | 40 | 444 TODO, 620 `any`, 102 console.log, dup validators (Stage 03) |
| DevOps | 55 | Strong tooling, but dup CI dirs, committed secrets, partial deploy (Stage 11) |
| Database | 22 | Missing migrations + `db push` data-loss fallback (Stage 04) |
| Testing | 38 | Placeholder/`expect(true)` tests, 89 skips, stub E2E (Stage 12) |
| Maintainability | 42 | Doc sprawl, dup configs, dead root `src/`/`workflows/` (Stage 01/11) |
| Scalability | 28 | Pool exhaustion, in-memory rate-limit/PubSub (Stage 10) |
| Production Readiness | 20 | Fails all 8 survival questions (Stage 14) |
| Technical Debt (higher = less debt) | 30 | High debt density across all stages |
| **OVERALL** | **34** | **Grade F** |

---

## Top Issues (sorted by severity)

### P0 — Release blockers
1. **Auth bypass via trusted `x-user-id`/`x-role` headers** — `services/courses-service/src/courses.controller.ts:22`, `services/content-service/src/plan/plan.resolver.ts:61-62`, +30 files. IDOR/priv-esc. (Stage 05 P0-01)
2. **`JWT_SECRET` optional in env validation** — `services/*/src/config/env.validation.ts:2` (17+). (Stage 05 P0-02)
3. **Hardcoded fallback secrets `'dev'`/`'change_me'`** — `content-service/plan.resolver.ts:61-62`, `certificate-service/certificate.service.ts:12`, `certificate/auth/roles.guard.ts:17`. (Stage 05 P0-03)
4. **Payment webhook unauthenticated (no signature)** — `services/payments-service/src/payments.controller.ts:15-18` + `payments.service.ts:36-73`. Free entitlements. (Stage 05 P0-04)
5. **Migrations absent for 20/25 DBs; `db push` data-loss fallback** — `services/*/prisma/migrations/.keep`, `package.json db:migrate:all`. (Stage 04 P0-01/P1-02)
6. **86 `new PrismaClient()` → pool exhaustion** — e.g. `payments.service.ts:13`. (Stage 10 P0-01)

### P1 — Must fix before scaling
7. Non-draining outbox in `services/payments-service` (`payments.service.ts:62`). (Stage 02 P1-05)
8. Un-transacted money/booking multi-writes in `services/*` (`payments.service.ts:39-62`). (Stage 03 P1-02)
9. SSRF via `fetch(ex.videoUrl)` + `execSync` command surface — `content-service/media.worker.ts:46,50,57`, `plan.resolver.ts:318-328`. (Stage 05 P1-05 / Stage 10 P1-02)
10. JWT verify without `algorithms` pinning — `certificate.service.ts:12`, `plan.resolver.ts`, `app/backend/auth/jwt.guard.ts:32`, `admin.guard.ts:13`. (Stage 05 P1-06)
11. Wildcard CORS with credentials + `ws origin:'*'` — `security-middleware/index.ts:44`, `graphql-gateway/main.ts:31`, `chat-service/chat.gateway.ts:5`. (Stage 05 P1-07)
12. Static shared admin bearer token — `app/backend/auth/admin.guard.ts:11`. (Stage 05 P1-08)
13. No global `ValidationPipe` in most services → mass assignment. (Stage 06 P1-01)
14. Dual monolith/microservice topology; `User` model triplicated. (Stage 02 P1-01 / Stage 04 P1-03)
15. Federation gateway omits most subgraphs + runtime `IntrospectAndCompose`. (Stage 08 P1-01/P1-02)
16. Placeholder/`expect(true)` tests + 89 skips + stub E2E. (Stage 12 P1-01/P1-02/P2-03)
17. Non-authoritative lockfile (`LOCKFILE_NOTE.txt`). (Stage 13 P1-01)
18. NestJS 10-declared / 11-forced version skew. (Stage 13 P1-02)
19. No API versioning + no idempotency on money endpoints. (Stage 09 P1-01/P1-02)
20. Blocking `execSync`/`*Sync` fs in resolver path. (Stage 10 P1-02/P2-04)
21. `apps/admin-web` ships both Next.js and Vite. (Stage 07 P1-01)
22. Two CI workflow dirs; overlapping pipelines. (Stage 11 P1-01)
23. K8s plaintext secret manifests committed. (Stage 05 P2-09 / Stage 11 P1-02)

### P2 — Medium term
24. Overlapping shared packages (auth/auth-kit, observability/observability-sdk, integration(s)). (Stage 02 P2-03)
25. In-memory rate-limit + PubSub don't scale horizontally. (Stage 10 P2-05)
26. `$queryRawUnsafe` on tables with no creating migration. (Stage 04 P2-04)
27. `Math.random()`-based UUIDs; mixed Int/UUID PK strategy. (Stage 04 P2-05)
28. Inconsistent error contract; error-message leakage. (Stage 09 P2-03)
29. Unbounded queries / missing pagination + unverifiable indexes. (Stage 09 P2-04 / Stage 10 P1-03)
30. 8 root-run Dockerfiles; partial deploy coverage across compose/k8s/helm. (Stage 11 P2-03/P2-05)
31. web-site App+Pages router mixing; stray `next.config.PHASE5_SNIPPET.js`. (Stage 07 P2-02)
32. 620 `any` incl. auth-critical context typing. (Stage 03 P2-04)
33. 102 `console.log` production logging. (Stage 03 P2-05)
34. Duplicated env-validation schema across 17 services. (Stage 03 P3-07)
35. `node-fetch@^1.0.0`. (Stage 13 P2-04)
36. Duplicate Dependabot/Renovate configs. (Stage 13 P2-05)
37. Swagger/OpenAPI in only ~9 of 34+ services. (Stage 06 P2-04)
38. Global guards/filters in only 3 apps. (Stage 06 P2-03)
39. No progressive delivery / automated rollback. (Stage 11 P2-04)
40. Seeded default admin creds (`Admin@12345`, `password123`). (Stage 05 P2-10)

### P3 — Long term / hygiene
41. Root documentation/report sprawl (35+ md/json). (Stage 01 P2-02)
42. Duplicate lint/prettier/jest/lighthouse configs. (Stage 01 P2-03)
43. `.gitignore.prev-round`, duplicate gitleaks configs, `COVERAGE.html`. (Stage 01 P3-04/P3-05)
44. Dead root `src/` `.ts` UI stubs. (Stage 07 P2-03)
45. Duplicate `app/backend/app.module.ts`. (Stage 06 P3-05)
46. Empty MIT copyright holder. (Stage 13 P3-06)
47. In-memory subscriptions won't fan out. (Stage 08 P3-05)
48. Thin ADRs / near-empty `architecture.md`. (Stage 02 P3-06)
49. Stray migration roots (`migrations/`, `docs/migrations/`). (Stage 04 P3-06)
50. Outbound `fetch` without timeouts. (Stage 09 P3-05)

*(Items 1–50 are the material findings; lower-ranked hygiene items from Stages 01–13 continue the list but are not release-relevant. Full detail per stage in `stage-01.md`…`stage-14.md`.)*

---

## Prioritized Roadmap

### IMMEDIATE (P0) — do before any deploy
- Remove **all** `x-user-id`/`x-role`/`query.userId` identity fallbacks; derive identity only from verified JWT; fail closed (#1).
- Make `JWT_SECRET` required (`min(32)`); delete `'dev'`/`'change_me'` literals (#2, #3).
- Add PSP HMAC signature verification to the payment webhook; reject unsigned (#4).
- Generate real Prisma migration histories (+`migration_lock.toml`) for all schemas; remove the `|| prisma db push` fallback (#5).
- Replace 86 `new PrismaClient()` with a single injectable `PrismaService`; add PgBouncer (#6).
- **Decision required (owner):** monolith `app/backend` **or** `services/*` as the production topology — this gates most other fixes.

### NEXT SPRINT (P1)
- Add outbox relay/worker per event-owning service; wrap money/booking flows in `$transaction` (#7, #8).
- Replace `execSync`→`execFile`; move media transcode fully to the queue; allowlist `videoUrl` hosts; block private IPs (#9).
- Pin JWT `algorithms`; lock CORS to an allowlist; remove `ws origin:'*'` (#10, #11).
- Replace static admin token with per-admin JWT + constant-time compare (#12).
- Global `ValidationPipe({whitelist,forbidNonWhitelisted})` in every bootstrap (#13).
- Static supergraph compose in CI; reconcile subgraph list (#15).
- Regenerate authoritative lockfile; enforce `--frozen-lockfile`; align NestJS to v11 (#17, #18).
- Delete placeholder/`expect(true)` tests; unskip or delete the 89 skips; wire a real E2E gate (#16).

### MEDIUM TERM (P2)
- Consolidate duplicate shared packages; extract shared env schema (#24, #34).
- Redis-backed rate-limit store + PubSub (#25, #47).
- Migrations for `idempotency_keys`/`outbox_events`; `crypto.randomUUID()`; standardize PK strategy (#26, #27).
- Unified error envelope + global exception filter everywhere; strip internal error text (#28).
- Enforce cursor pagination + verify indexes with `EXPLAIN` (#29).
- Add non-root `USER` to remaining Dockerfiles; unify deploy manifests across all services (#30).
- Resolve admin-web Next-vs-Vite and web-site router mixing (#21, #31).
- API versioning + idempotency keys on money endpoints (#19).

### LONG TERM (P3)
- Purge root report/doc sprawl into `docs/history/`; one canonical README (#41).
- Consolidate lint/prettier/jest/lighthouse configs to one each (#42).
- Delete dead `src/` UI stubs, `.gitignore.prev-round`, duplicate gitleaks/dependabot, `COVERAGE.html` (#43, #44, #36).
- Populate ADRs (topology, aggregate ownership) and `architecture.md` (#48).
- Progressive delivery (Argo Rollouts/Flagger) with SLO-based auto-rollback (#39).
- Outbound `fetch` timeouts + reuse the existing circuit breaker widely (#50).

---

## Certification Decision

**REJECTED — Grade F. Not certified for production.**

Re-audit gate: certification can be reconsidered only after **all six P0s** are closed and independently re-verified from source, the production topology is chosen and the other removed, and a real migration + lockfile + non-placeholder test baseline is in place.
