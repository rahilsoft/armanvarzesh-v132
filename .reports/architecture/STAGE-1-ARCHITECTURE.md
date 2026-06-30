# Stage 1–3 — Repository Inventory, Dead-Code Detection & Dependency Graph

> Foundation roadmap, steps 1–4. Read-only analysis. Build/typecheck/lint are
> unaffected by this stage (no source code changed).
> Generated: 2026-06-30. Branch: `claude/project-completion-prompt-0y30ok`.

## 0. Executive summary — the one finding that matters

The repository contains **three competing, overlapping topologies for the same
domains**, and the deployment manifests disagree about which one is real:

| Topology | Where | What it deploys | Models |
|---|---|---|---|
| **Monolith** | `app/backend` | `deploy/docker-compose.prod.yml` → `backend` (this is what *production* runs) | 37 |
| **Mega-service** | `services/content-service` | not deployed by any manifest | 48 |
| **Focused microservices** | `services/*` (33) + `app/*-subgraph` (4) | `docker-compose.yml` deploys only auth-service + 3 subgraphs + api-gateway; `graphql-gateway` composes a *different* 8-subgraph set that nothing deploys | 1–8 each |

The same domain is implemented up to **three times**: e.g. `User` exists in
`app/backend`, `services/auth-service`, and `services/users-service`; `Workout`
in `app/backend`, `services/workouts-service`, and `app/activity-subgraph`;
chat/nutrition/notifications/challenges live both in `app/backend`,
`content-service`, *and* their own dedicated services.

**This is the canonical-model fork the roadmap (steps 5–7) hinges on, and it
cannot be resolved by code analysis alone — it is a product/infra decision.**
Steps 1–4 (inventory, dead-code, dependency graph, this document) are complete
and below. Steps 5–7 (consolidate canonical domain model, unify schemas, delete
duplicates) are **blocked on that decision** and are escalated to the user, not
guessed.

---

## 1. Inventory (step 1)

- **33 services**, **36 packages**, **10 `app/*` targets**, **3 frontends**.
- **24 `schema.prisma`** files, **154 distinct Prisma models**.
- Source size ≈ 123k LOC. Per-component detail: `.reports/inventory/services.tsv`,
  `.reports/inventory/packages.tsv`.

### Service size distribution (notable)
- **Outliers / second monoliths:** `content-service` (3,609 LOC, 48 models, 25
  resolvers, 116 `as any`), `auth-service` (1,027 LOC), `nutrition-service`
  (1,360), `workouts-service` (932, 16 `Promise<any>`).
- **Empty stubs (1 LOC, `_noop.ts` only):** `ml-service`, `workers`. `api-gateway`
  is a JS-only shim (`main.js`, `jwt-verifier.js`).
- **Thin/scaffold services (<200 LOC):** analytics-service, assessments-service,
  certificate-service, inbox-service, kpis-service, media-worker, medical-service,
  physio-service.

## 2. Dead / orphaned / generated code (step 2)

- **Generated artifacts:** ✅ none committed — `dist/` and `generated/` are
  git-ignored (0 tracked files). Local `dist/` seen on disk is build output only.
- **Orphan library packages (0 internal consumers, in `packages/*`):** 17 —
  `auth`, `auth-kit`, `client-live`, `contracts`, `contracts-tests`, `env-config`,
  `graphql`, `graphql-dataloader`, `graphql-utils`, `infra`, `integrations`,
  `libs`, `nest-bootstrap`, `observability` (note: distinct from the heavily-used
  `observability-sdk`), `resilience`, `shared`, `theme`. Several are 1-LOC
  placeholder packages (`auth`, `graphql`, `contracts`, `integrations`, `libs`,
  `theme`).
- **Stub services:** `ml-service`, `workers` (noop only) — candidates for removal
  or real implementation.
- **Design-doc markdown committed inside `src/`:** 7 `STEPnn_*.md` files (e.g.
  `app/backend/src/STEP43_DOMAIN_LAYER_CODE.md`) — docs masquerading as source.

## 3. Real dependency graph (step 3)

73 workspace packages with `package.json`; **104 internal edges**.

**Load-bearing shared packages (keep, harden):**
- `@arman/observability-sdk` — 39 consumers
- `@arman/security-middleware` — 33 consumers
- `@arman/service-kit` — 10 consumers (Express service bootstrap; see §5 debt)
- `@arman/integration` — 10 consumers
- `@arman/ui-tokens`, `@arman/ui-components` — 2 each (frontend)

Everything else has ≤1 internal consumer. The 17 orphan libs above have 0.

## 4. Duplicated Prisma models (step 6 evidence)

15 model names defined in more than one schema (full list in run log). The
3-way and cross-domain duplicates:

- `User` ×3 — users-service, auth-service, app/backend
- `Workout` ×3 — workouts-service, app/activity-subgraph, app/backend
- `Notification`, `Challenge`, `Subscription`, `Meal`, `Coach`, `Course`,
  `Message`, `Attachment`, `Food`, `MealLog` — each in app/backend **and** a
  dedicated service (monolith ⟷ microservice overlap)
- `ChatMessage` — chat-service **and** content-service (mega-service overlap)
- `Certificate` — courses-service **and** certificate-service
- `Slot` — medical-service **and** booking-service

## 5. Cross-cutting technical debt (carried into the debt report)

- **`Promise<any>`:** 108 occurrences (concentration: workouts-service 16,
  content-service).
- **`as any`:** 140 files (concentration: content-service 116, security-middleware
  9, http-client 13).
- **`@ts-ignore` / `@ts-nocheck`:** ~14 (service-kit, security-middleware,
  integration, state).
- **`service-kit`** casts middleware to `any` (`compression() as any`,
  `rateLimit(...) as any`) to paper over the @types/express v4↔v5 split — a
  latent typing hole in a 10-consumer package.

---

## 6. Decision required before steps 5–7

Steps 5 (canonical domain model), 6 (unify schemas/DTOs/repos) and 7 (delete
duplicate implementations) all require choosing the **target topology**. The
three honest options:

1. **Microservices + federation is canonical** → `app/backend` monolith and
   `content-service` mega-service are decomposed/retired; production compose is
   rewritten to deploy the service mesh. (Largest change; matches the `services/*`
   + subgraph investment and the gateway code.)
2. **Monolith (`app/backend`) is canonical** → the 33 services + subgraphs are
   retired; keep one Prisma schema. (Matches what *production* actually deploys
   today; smallest deployable surface.)
3. **Documented hybrid** → monolith for core transactional domains, a named
   short-list of services for the rest; everything else deleted. Requires an
   explicit per-domain ownership table.

Until this is chosen, deleting either side would be guessing — and deleting the
side production runs, or the side the team has invested 33 services into, is
exactly the irreversible, architecturally-significant action that must not be
taken unilaterally.
