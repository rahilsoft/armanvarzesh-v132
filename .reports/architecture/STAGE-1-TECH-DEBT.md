# Stage 1 — Technical Debt Report

Branch `claude/project-completion-prompt-0y30ok` · 2026-06-30 · read-only stage.

Ranked by blast radius. "Owner-decision" items cannot be fixed by code alone.

| # | Debt | Severity | Scope | Resolution path |
|---|---|---|---|---|
| D1 | Three overlapping topologies (monolith / mega-service / microservices) for the same domains | **Critical** | repo-wide | Owner decision (architecture report §6) → then steps 5–7 |
| D2 | 15 Prisma models duplicated across schemas; `User`/`Workout` defined 3× | **Critical** | data model | Blocked on D1; then one canonical schema per domain |
| D3 | Deploy manifests disagree (prod=monolith, dev=partial federation, gateway=8 other subgraphs) | High | infra | Rewrite compose to match chosen topology (D1) |
| D4 | 116 `as any` in content-service; 140 files repo-wide; 108 `Promise<any>` | High | type safety | Per-service typing pass during each vertical |
| D5 | 17 orphan packages (0 consumers), 6 of them 1-LOC placeholders | Medium | packages | Delete placeholders; fold/keep real ones after D1 |
| D6 | Stub services `ml-service`, `workers` (noop only); `api-gateway` is JS-only | Medium | services | Implement or remove with D1 |
| D7 | `service-kit` casts express middleware to `any` (@types/express v4↔v5 split) | Medium | 10 consumers | Pin types, remove casts, add typed wrapper |
| D8 | `@ts-ignore`/`@ts-nocheck` ×14 (service-kit, security-middleware, integration, state) | Low | scattered | Replace with real types incrementally |
| D9 | 7 `STEPnn_*.md` design docs committed inside `src/` | Low | hygiene | Move to `/docs` or delete |
| D10 | Only ~9 of 321 test files exceed 30 lines — tests are largely smoke-only | High | quality | Real tests added per vertical against real Postgres |

## Already paid down (prior stages, for context)
- Full TypeScript-green across backend + 33 services + app-tier + packages.
- Per-project Prisma client isolation (`output="./generated/client"` + path map).
- `full-pipeline.yml` CI (verify/db-apply/e2e); 7 CI resolution fixes landed.
- auth-service security rewrite (selector/verifier refresh, rotation, theft
  detection) — **note:** paused per user instruction to stabilize foundation first.

## Not-this-stage (explicitly out of scope here)
- Pre-existing red infra CI (Cloudflare deploy, buildx-bake, detox native,
  Trivy/SBOM) — need secrets/native projects/policy, independent of this work.
