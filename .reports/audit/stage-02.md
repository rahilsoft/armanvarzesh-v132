# Stage 02 — Architecture Audit

**Source of truth:** repository only.

---

## Findings

### P1-01 — No single source of truth: monolith and microservices duplicate every bounded context
**Evidence:** `app/backend/src/` contains `auth/`, `payments/`, `courses/`, `nutrition/`, `medical/`, `chat/`, `notifications/`, `marketplace/`, `coaches/`, `challenges/`, `gamification/`, `leaderboard/` … and `services/` contains standalone services with the identical names (`auth-service`, `payments-service`, `courses-service`, …, 34 total). Prisma `model User` is defined **three times**: `services/auth-service/prisma/schema.prisma`, `services/users-service/prisma/schema.prisma`, `app/backend/src/database/prisma/schema.prisma`.
**Why it is a problem:** Bounded contexts are not actually bounded — the same aggregate (User, Payment, Course) lives in ≥2 codebases with independent schemas. There is no canonical model. Dependency direction is undefined because both topologies claim ownership.
**Production impact:** Data-ownership ambiguity; two services can both believe they own `User`, causing write conflicts and drift.
**Recommended fix:** Choose microservices *or* monolith. Declare one owner per aggregate in an ADR.
**Effort:** L. **Risk:** High.

### P1-02 — Federation subgraph set is inconsistent with deployed services
**Evidence:** `services/graphql-gateway/src/main.ts` lines 10–20 hardcode a default subgraph list of only 8 subgraphs (`activity`, `social`, `physio`, `live`, `users`, `coaches`, `nutrition`, `content`). But `@Resolver`/subgraph schemas exist across far more services (`grep -rln '@Resolver'` → 71 files; subgraph `@key`/`buildSubgraphSchema` in `app/activity-subgraph`, `app/social-subgraph`, `app/physio-subgraph`, `app/live-subgraph`, and multiple `services/*`).
**Why it is a problem:** The gateway composition omits most GraphQL-capable services. Either those resolvers are dead, or the gateway is incomplete. Cannot be both correct.
**Production impact:** Queries to unlisted subgraphs fail at the gateway; or dead resolver code ships.
**Recommended fix:** Reconcile `SUBGRAPHS_JSON` default with the actual subgraph inventory; enforce in CI via a supergraph compose check.
**Effort:** M. **Risk:** Medium.

### P2-03 — Shared packages are numerous and overlapping (shared-package abuse risk)
**Evidence:** `packages/` holds **32** packages including overlapping concerns: `auth` + `auth-kit`; `integration` + `integrations` + `integrations/livekit`; `observability` + `observability-sdk`; `http-client` + `shared/src/http`; `graphql-utils` + `graphql-dataloader`. `service-kit`, `nest-bootstrap`, `shared` all provide bootstrap helpers.
**Why it is a problem:** Multiple packages solve the same problem (two auth libs, two observability libs, two integration libs). Consumers pick inconsistently, defeating the point of shared code.
**Production impact:** Inconsistent auth/observability behavior between services depending on which lib they imported.
**Recommended fix:** Consolidate the duplicate pairs; deprecate one of each.
**Effort:** M. **Risk:** Medium.

### P2-04 — Clean/Hexagonal architecture only partially applied
**Evidence:** `app/backend/src/lib/domain/`, `app/backend/src/lib/data/repositories/`, `app/backend/src/application/`, `app/backend/src/domain/` show a ports/adapters intent (`user.repository.ts`, `auth.usecase.ts`). But most `services/*` put business logic directly in a single `*.service.ts` with `prisma = new PrismaClient()` inline (e.g. `services/payments-service/src/payments.service.ts:13`), i.e. no repository layer, no domain isolation.
**Why it is a problem:** Architecture is aspirational in `app/backend` and absent in `services/*`. SOLID/DRY are locally violated (see Stage 03).
**Production impact:** Hard to test, tightly coupled to Prisma, no seam for transactions.
**Recommended fix:** Standardize a repository/uow layer or accept transaction-script style explicitly in an ADR.
**Effort:** L. **Risk:** Medium.

### P2-05 — Outbox pattern implemented in only one place; others fake it
**Evidence:** A real outbox dispatcher exists only in `app/backend/src/infra/outbox.dispatcher.ts` + `outbox.prisma.repo.ts`. In `services/payments-service/src/payments.service.ts:62` an outbox row is written (`domainEventOutbox.create`) but there is **no dispatcher/relay** in `services/payments-service` (grep for outbox dispatch/poll/relay returns only `app/backend`).
**Why it is a problem:** Events are written to an outbox table that nothing drains → events never delivered. This is a silent correctness failure (payments emit `ENTITLEMENT_GRANTED` that never fires).
**Production impact:** Paid users never receive entitlements; classic outbox-without-relay bug.
**Recommended fix:** Add a relay/worker per service that owns an outbox, or use a shared dispatcher.
**Effort:** M. **Risk:** High (revenue-affecting).

### P3-06 — ADRs present but thin
**Evidence:** `adr/` directory exists and `architecture.md` (204 bytes) is a near-empty stub.
**Recommended fix:** Populate ADRs for the monolith-vs-services and aggregate-ownership decisions.
**Effort:** S. **Risk:** Low.

---

## Positives
- Federation gateway uses `RemoteGraphQLDataSource` with auth header propagation (`JwtDataSource`, gateway `main.ts:22`).
- `app/backend` demonstrates intent toward clean architecture (domain/application/data layers).

## Stage score: **45/100** (Architecture)
The dual-topology problem and the non-draining outbox are the dominant risks.
