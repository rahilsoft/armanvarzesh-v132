# Technical debt delta — Phase 1 → v0.3 baseline

Baseline register: `.reports/architecture/STAGE-1-TECH-DEBT.md` (D1–D10).

## Movement since Phase 1

| # | Debt | Phase-1 state | v0.3 state | Direction |
|---|---|---|---|---|
| D1 | Three overlapping topologies | Open, undecided | **Decided** (hybrid, owner-approved) + 3 core domains consolidated (Auth, Users, Payments) | ▲ major progress |
| D2 | 15 duplicated Prisma models; User/Workout ×3 | Open | `User` canonicalised (auth-service + users-service variants superseded); `Subscription`, `Notification`… monolith-vs-service dups resolved *for folded domains*. `Workout` still ×3 (next). Canonical schema 37→46 models | ▲ progress |
| D3 | Deploy manifests disagree | Open | Unchanged — now explicitly gated as G3 in the retirement matrix | ▬ tracked |
| D4 | `as any` ×140 files / `Promise<any>` ×108 | Open | −1 `as any` (users resolver); no new ones introduced in ~700 new lines (folds are cast-free). Bulk remains (content-service 116) pending its dismemberment | ▲ slight |
| D5 | 17 orphan packages | Open | **14** (3 empty ones deleted); discovered 3 of the rest are *used-but-undeclared* by backend (see D11) | ▲ progress |
| D6 | Stub services | Open | `ml-service` deleted; `workers` remains (kept — needs real impl for outbox relay) | ▲ half done |
| D7 | service-kit `as any` middleware casts | Open | Unchanged (10 consumers) | ▬ |
| D8 | `@ts-ignore` ×14 | Open | Unchanged | ▬ |
| D9 | 7 `STEPnn_*.md` docs inside `src/` | Open | Unchanged | ▬ |
| D10 | Tests mostly smoke-only (9/321 >30 lines) | Open | **+3 real suites, 16 tests** covering security-critical auth flow, users write path, payments checkout/idempotency. Integration/E2E vs real Postgres still CI-only | ▲ progress |

## Debt paid down that wasn't on the register

- **Data-loss bug fixed** (Users): profile fields accepted by the API but
  silently dropped before persistence.
- **Backend Prisma client misresolution fixed**: `app/backend/tsconfig.json`
  resolved a *sibling service's* generated client (`users-service` shape) —
  IDE/raw-tsc type checking was validating against the wrong schema.
- **Sync cross-service coupling removed**: payments → booking `fetch()` replaced
  with `DomainEventOutbox` event.
- **Offline Prisma workflow** (`scripts/prisma-offline.sh`) — schema changes are
  now verifiable in-sandbox instead of only in CI.

## New debt introduced (deliberate, tracked)

| # | Item | Why accepted | Exit |
|---|---|---|---|
| D11 | `app/backend` declares **none** of the 8 `@arman/*` packages it imports (`graphql-dataloader`, `graphql-utils`, `observability`, `auth-kit`, `env-config`, `http-client`, `integration`, `security-middleware`) — resolution rides on tsconfig path aliases only, which is why 3 of them look like orphans in the package graph | Pre-existing, surfaced by the graph refresh | Declare workspace deps in `app/backend/package.json`; then the orphan list shrinks to true orphans |
| D12 | `PaymentsModule` (incl. folded `CheckoutService`) not wired into `app.module` — no live HTTP surface | Pre-existing unwired module; wiring + JWT guard is its own reviewed change (PAYMENTS-WIRE) | Wire module + `CheckoutController` + webhook route |
| D13 | 3 DEPRECATED services still deployed by dev compose/k8s/gateway | Retirement gated on CI runtime validation per owner rule | \*-RETIRE commits after G2 |
| D14 | `Subscription` has two usage profiles (Stripe `provider/externalId` vs internal plan flow) in one model | Chosen to avoid a duplicate model; documented in ADR-B4 | Document lifecycle; revisit if flows diverge |
| D15 | Legacy admin-auth cluster in monolith (`auth.service.ts`, `auth.resolver.ts`, `local.strategy.ts`) unregistered/dead | Kept to scope the Auth commit; admin path still live via `AdminController` | Remove in Users/Admin cleanup pass |
| D16 | Three scattered ADR directories (`adr/`, `docs/ADR/`, `docs/adr/`) | Found during baseline; consolidation is a docs move, not urgent | Merge into `docs/adr/` (see ADR-INDEX) |

## Net position

Foundation debts are now either **resolved**, **owner-decided**, or **gated with
explicit exits** — none are silently drifting. The largest remaining masses are
`content-service` dismemberment (D2/D4 bulk) and manifest rewiring (D3/D13).
