# ADR index — v0.3 baseline

## A. Decisions made in the consolidation program (this branch)

These are owner-approved decisions recorded in the phase reports; they carry
ADR force. (Formal one-file-per-ADR extraction into `docs/adr/` is queued as
part of D16 consolidation.)

| ID | Decision | Status | Recorded in |
|---|---|---|---|
| ADR-B1 | **Hybrid topology**: modular monolith for core transactional domains; dedicated microservices for independently-scalable/async domains; strangler seams from day one | Accepted (owner) | `DOMAIN-OWNERSHIP.md` |
| ADR-B2 | **PK strategy**: Int autoincrement for core monolith domains (Users, Auth, Payments, Workout, Nutrition); UUID for extension domains (Gamification, AI, Chat, Notifications, Media) | Accepted (owner) | `PHASE-3-AUTH-MIGRATION.md` |
| ADR-B3 | **Auth source**: port hardened auth-service implementation as-is (argon2, selector/verifier rotation, theft detection); do not rewrite | Accepted (owner) | `PHASE-3-AUTH-MIGRATION.md` |
| ADR-B4 | **Provider-linked entities**: Int PK + `String @unique` external reference (`providerSessionId`, `eventId`); reuse canonical `Subscription` via `provider="internal"` instead of a duplicate model | Accepted | `PHASE-4-PAYMENTS-MIGRATION.md` |
| ADR-B5 | **Cross-domain async via outbox**: replace synchronous cross-service HTTP (payments→booking) with `DomainEventOutbox` events | Accepted | `PHASE-4-PAYMENTS-MIGRATION.md` |
| ADR-B6 | **Gated retirement**: DEPRECATED services deleted only after fold + CI runtime validation + infra rewire (G1–G4) | Accepted (owner) | `RETIREMENT-MATRIX.md` |
| ADR-B7 | **Per-project Prisma client isolation**: every schema generates to `./generated/client` with a tsconfig `@prisma/client` path map (backend gap fixed in Phase 3) | Accepted | `PHASE-3-AUTH-MIGRATION.md` |
| ADR-B8 | **One domain, one commit**: each fold ends with build/typecheck/tests green + migration & debt reports before the next begins | Accepted (owner) | phase reports |

## B. Pre-existing ADRs found in the repo (D16: three scattered directories)

| Location | Files | Assessment |
|---|---|---|
| `docs/adr/` | 14 (governance, JWT/CORS, CI/CD, observability, monorepo, backend stack, federation v2, phase logs) | Richest set; **proposed canonical home** |
| `docs/ADR/` | 7 (comms standard, caching, observability, HA posture) | Overlaps `docs/adr/`; merge in |
| `adr/` | 1 (template only) | Delete after merge |

Note: `docs/adr/ADR-002-graphql-federation-v2.md` predates ADR-B1 and framed
federation as the primary topology; it is **superseded in part** by ADR-B1
(federation remains for the extension layer only). Flag when consolidating.

## C. Open decisions (will need ADRs when reached)

- Edge: `graphql-gateway` vs `api-gateway` final shape (retire or demote shim).
- `Subscription` dual-profile lifecycle if Stripe and internal flows diverge (D14).
- Search service (named in ownership map §B; no implementation exists).
- Outbox relay: `workers` service implementation & delivery semantics.
