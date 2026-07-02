# Architecture — v0.3 baseline (pre-Workout checkpoint)

State as of commit `7373d88` on `claude/project-completion-prompt-0y30ok`.
This is the rollback point before the Workout fold (tag: `v0.3-architecture-baseline`).

## Target topology (approved) vs current state

```mermaid
flowchart TB
    subgraph clients["Clients"]
        web["apps/web-site"]
        admin["apps/admin-web"]
        mobile["apps/mobile-user"]
    end

    subgraph edge["Edge"]
        gql["services/graphql-gateway<br/>(Apollo Federation v2)"]
        api["services/api-gateway<br/>(JS shim — retire/demote pending)"]
    end

    subgraph monolith["Modular monolith — app/backend (canonical core, Int PKs, ONE Prisma schema: 46 models)"]
        direction TB
        authM["Auth ✅ folded<br/>UserAuthModule (wired)"]
        usersM["Users ✅ folded<br/>UsersModule"]
        payM["Payments ✅ folded<br/>PaymentsModule + CheckoutService<br/>(module not yet in app.module)"]
        workoutM["Workout ⏳ next"]
        nutriM["Nutrition ⏳"]
        bookM["Booking ⏳"]
        gamiM["Gamification ⏳"]
        mediM["Medical / Physio ⏳"]
        adminM["Admin login (env, separate path)"]
    end

    subgraph ext["Extension microservices (kept, own schemas, UUID PKs)"]
        ai["ai-service"]
        notif["notifications-service<br/>(+inbox-service folds in)"]
        chat["chat-service"]
        media["media-worker → media-service"]
        analytics["analytics-service<br/>(+collector, kpis fold in)"]
        activity["activities-service"]
        social["social-subgraph"]
        live["live-subgraph"]
        predictive["predictive-service"]
        workers["workers (background jobs — needs impl)"]
    end

    subgraph deprecated["DEPRECATED (folded; physical retirement gated on CI validation + infra rewire)"]
        authS["services/auth-service"]
        usersS["services/users-service"]
        paymentsS["services/payments-service"]
    end

    subgraph pendingFold["Pending fold (per ownership map)"]
        contentS["content-service (48 models — dismember)"]
        workoutsS["workouts-service"]
        others["nutrition/booking/medical/physio/<br/>challenges/rewards/vip/affiliate/<br/>courses/certificate/assessments/<br/>coaches/marketplace…"]
    end

    subgraph infra["Infra"]
        pg[("PostgreSQL")]
        redis[("Redis")]
        rmq[("RabbitMQ")]
        obs["observability stack<br/>(otel-collector, prometheus, tempo, grafana)"]
    end

    clients --> gql
    clients --> api
    gql --> monolith
    gql --> ext
    monolith --> pg
    monolith -. "DomainEventOutbox<br/>(BOOKING_PAYMENT_SUCCEEDED,<br/>ENTITLEMENT_GRANTED)" .-> workers
    ext --> pg
    ext --> rmq
    deprecated -. "traffic must be repointed<br/>before deletion" .-> monolith
```

## Load-bearing shared packages (keep, harden)

| Package | Consumers | Role |
|---|---|---|
| `@arman/observability-sdk` | 39 | otel/register bootstrap |
| `@arman/security-middleware` | 33 | JWT verify, CSP, rate limit |
| `@arman/service-kit` | 10 | Express service bootstrap (has `as any` debt, D7) |
| `@arman/integration` | 10 | db/queue helpers |

## Strangler seams (extraction contract)

Every folded core domain exposes only its module's public service API
(`UserAuthService`, `UsersService`, `CheckoutService`) and communicates
cross-domain via `DomainEventOutbox` where async. No direct cross-module
imports of internals — this is what keeps later extraction to a microservice
non-breaking.

## Deploy-manifest truth table (unchanged since Stage 1 — still D3)

| Manifest | Deploys | Consistent with target? |
|---|---|---|
| `deploy/docker-compose.prod.yml` | monolith (`backend`) + vitrin | Partially — misses kept extension services |
| `docker-compose.yml` (dev) | auth-service, 3 subgraphs, api-gateway, infra | No — deploys a DEPRECATED service |
| `services/graphql-gateway` defaults | 8 subgraphs incl. users/content | No — routes to DEPRECATED/pending services |
| `k8s/` | per-service incl. auth-service | No — includes DEPRECATED services |

Rewiring these is the **\*-RETIRE** follow-up series, gated on CI runtime validation.
