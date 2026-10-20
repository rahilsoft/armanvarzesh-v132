# Arman Varzesh — status & deploy readiness

Maintained by `coordinator-architect`. Only verified facts. Newest session on top.

## Deploy readiness: ❌ NOT READY

| Gate | Status | Evidence (command / result) |
|---|---|---|
| Deploy path targets `app/backend` only | ⚠️ | 2026-10-19 night: helm/deploy/k8s/CI/compose/bake no longer reference removed services (grep empty). Open: `services/graphql-gateway/src/main.ts` still defaults to dead subgraphs, `helm template` not run (no helm in sandbox) |
| All P0 security items closed | ❌ | 2026-10-20 night: Zarinpal verify uses stored amount by authority, idempotent, webhook HMAC fail-closed outside dev/test, strict hex signature (all APPROVED, merged). Open: Zarinpal request/callback routes not registered in PaymentsModule, P0-1 `x-user-id` sweep, replay protection |
| No mocks / stubs in production paths | ❌ | inventory done: `docs/agents/MOCK_INVENTORY.md` 68 sites (9 P0, 18 P1, 41 P2), burn-down not started |
| Backend typecheck + lint + unit tests green | ✅ | 2026-10-20 night on develop 9210d73: typecheck exit 0, lint exit 0, 43 suites / 207 tests passed (2 suites, 69 tests skipped), 0 failed |
| Backend e2e against real Postgres + Redis green | ❌ | not yet run |
| Real Prisma migrations, no `db push` | ❌ | ROADMAP 0.5 |
| Web site + admin production builds green | ⚠️ | reported green 2026-06-29, re-verify |
| Mobile user + coach typecheck + EAS preview build | ❌ | eas.json not configured |
| All core modules work end to end (ROADMAP phases 2–5) | ❌ | not started |
| All required secrets provided by owner | ❌ | see «Secrets needed» |
| Security reviewer final approval | ❌ | — |

When every gate is ✅ the coordinator writes **READY FOR DEPLOY** here with the `develop` commit.

## Secrets needed (owner must provide — never commit them)
Set them as environment / CI / EAS secrets. Agents add rows as they discover needs.

| Secret | Used for | Status |
|---|---|---|
| `DATABASE_URL` (production PostgreSQL) | backend (now validated at boot outside dev/test) | missing |
| `REDIS_URL` | cache, BullMQ | missing |
| `JWT_SECRET`, `REFRESH_JWT_SECRET`, `ADMIN_JWT_SECRET`, `JWT_ACCESS_SECRET` (each ≥ 32 chars, fail-fast outside dev/test) | auth | missing |
| `JWT_KID` | JWKS key id, required outside dev/test | missing |
| `CERT_SECRET` (≥ 32 chars, required outside dev/test) | course certificates signing | missing |
| `PAYMENTS_WEBHOOK_SECRET`, `MEDICAL_WEBHOOK_SECRET` | HMAC of payment/booking and medical webhooks (now required in staging + production) | missing |
| `ZARINPAL_MERCHANT_ID`, `PAYMENT_PROVIDER=zarinpal`, `ZARINPAL_CALLBACK_URL` (opt. `ZARINPAL_SANDBOX`) | payments | missing |
| `KAVENEGAR_API_KEY` + sender line | OTP / SMS | missing |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | media storage | missing |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | live sessions | missing |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | email | missing |
| AI provider API key | AI module | missing |
| Expo / EAS account + `EXPO_TOKEN` | mobile builds, push | missing |
| Apple Developer account (APNs key) | iOS push, TestFlight | missing |
| Google Play / Cafe Bazaar / Myket developer accounts + keystore | Android release | missing |
| Production domain + TLS, hosting/k8s access | deploy | missing |

## Owner decisions
- 2026-10-19: Team of 9 agents created. Nightly window 22:00–23:00 Tehran. Work lands on `develop`.
- 2026-10-19: Owner approved deleting the deprecated `services/*`. Done: 14 folders with `DEPRECATED.md` removed (affiliate, assessments, challenges, coaches, content, courses, inbox, kpis, medical, nutrition, payments, physio, rewards, users), plus their k8s manifests/secrets, `helm/users-service`, and entries in docker-bake, CI matrix, Prometheus, deploy/helm values, compose.elite. 11 active services remain.
- 2026-10-20: Owner set the Claude ↔ GPT collaboration protocol (`docs/agents/COLLABORATION_GPT.md`): GPT reviews daily 00:05 Tehran in a fixed GitHub issue, Claude answers every finding at shift start. Owner also instructed: no questions to him unless he asks, development continues without his approval even if he is offline.
- 2026-10-20: Owner extended the nightly window to three hours, 21:00–24:00 Tehran (scheduled task now fires 21:02).
- 2026-10-20: Owner made integration a standing duty every shift and granted permission to merge ready PRs (incl. `develop → main`), never bypassing branch protection. Responsibility ends at merge + target CI check. Assigned to `qa-test-engineer` (integration owner).
- 2026-10-20: Owner approved merging `develop` into `main` (PR #53, merge commit 828077f), deploy readiness still NOT READY.
- 2026-10-19: Owner delegated all technical decisions to the team (see CLAUDE.md «Decision authority»). He reviews nightly reports and sends guidance.

## Decisions log
| Date | Decision | Rationale |
|---|---|---|
| 2026-10-19 | Path A: `app/backend` monolith is production | Hardened, all gates green; services carried P0 defects |
| 2026-10-19 | Work lands on `develop`, `main` only via owner-approved release | Keeps production stable |
| 2026-10-19 | Merge only security-approved branches, payments branch held back | Reviewer found callback amount taken from client payload (underpay risk) |
| 2026-10-19 | Removed stale graphql-gateway subgraph env (users/coaches/nutrition/content) instead of pointing all four at the monolith | Four subgraphs on one schema would conflict, gateway gets `BACKEND_URL` |
| 2026-10-20 | Payment verify reads expected amount from `"Payment"` row by authority, conditional UPDATE for idempotency | Client callback amount cannot be trusted, race-safe single credit |
| 2026-10-20 | Webhook HMAC skip and secret fallbacks allowed only for NODE_ENV exactly development/test, `staging` is strict | Unset or unknown env must never disable verification |
| 2026-10-20 | Gateway business rejections (e.g. -51) not retried and not counted by circuit breaker | User cancels must not trip the breaker |
| 2026-10-20 | From the next shift `ui-ux-designer` (+ `web-frontend-engineer` / `mobile-engineer`) runs ROADMAP 1.2 and 1.3 every night in parallel with Phase 0 | Three-hour window allows it, design files do not overlap backend scope, and UI is the longest path to deploy |
| 2026-10-20 | `qa-test-engineer` is the integration owner | Already owns CI and test suites, keeps coordinator free for planning |
| 2026-10-19 | Open: iOS distribution path for Iran — coordinator decides in a later session | Needs research on Sibche / TestFlight / PWA |

## Integration (PR sweep, updated every shift)
| PR | Target | State | Blocker / action |
|---|---|---|---|
| #53 develop → main | main | merged 828077f | — |
| #52 claude/project-review-improvement → main | main | open, blocked | 41 conflicts vs develop (modify/delete in removed `services/*` + lockfile), re-adds removed services, CI stale (2026-10-09, Workers Builds failed). Action: next session merge develop into it, drop removed paths, regen lockfile, gate + security review, merge via develop |
| #3 p-limit 7 (media-worker) | main | applied on develop 249ab35, closed | reaches main with next release |
| #4 uuid 13 (media-worker, live-subgraph) | main | applied on develop 249ab35, closed | reaches main with next release |
| #46 jose 6 | main | closed | backend Jest is CJS, jose 6 ESM-only → 1 suite fails (`Unexpected token 'export'`). Action: add Jest ESM transform, then upgrade |
| #47 @nestjs/websockets 11.1.28 | main | closed | root `pnpm.overrides` pins 11.1.6, bump has no effect. Action: raise @nestjs/* overrides as a group |
| #45 expo-constants 57 | main | closed | incompatible with Expo SDK 51 (needs ~16) |
| #2 @nestjs/platform-socket.io 11 (chat-service) | main | closed | legacy service on Nest 10 core, unmet peer |
| #1, #8, #9, #11 | main | closed obsolete | target services removed 2026-10-19, conflicts |

## Known blockers
- Sandbox cannot download Prisma engines (`binaries.prisma.sh` → 403). **Solved for types:** `scripts/agents/prisma-generate-offline.sh` generates the client with placeholder engines, enough for typecheck + unit tests. Still open: runtime / e2e against a real DB need real engines → run those on GitHub Actions CI.
- `helm/graphql-gateway/values.yaml` still federates subgraph URLs of removed services (users, coaches, nutrition, content). Repoint to `app/backend` in ROADMAP 0.1.

## Session log
### 2026-10-20 night (22:02–22:30 Tehran) — nightly session 2
Done (merged into `develop`, security-reviewer APPROVED each branch, gates green):
- ROADMAP 0.4 (partial): `agent/backend-engineer/payments-real-provider` (a9c9ec6). `PaymentStore` + `PrismaPaymentStore` (parameterized `Prisma.sql`), verify uses stored amount by authority, unknown authority rejected, already-paid idempotent, conditional UPDATE race-safe, paid only after Zarinpal 100/101. `PaymentsService.verify` routed through the provider.
- ROADMAP 0.4 (partial): `agent/backend-engineer/payments-wiring` (5a02763). Callback `Amount` optional (no NaN), real `Status` forwarded (missing → rejected), `requestPayment` persists authority + amount + pending into `"Payment"`, Zarinpal `post()` timeout (`ZARINPAL_TIMEOUT_MS`, default 10000) + `res.ok`, business rejections not retried.
- ROADMAP 0.6: `agent/backend-engineer/webhook-env-hardening` (c01dcdc). HMAC fail-closed unless NODE_ENV development/test, NODE_ENV `staging` valid + strict, `CERT_SECRET` min 32 required, `domain.module` JwtModule registerAsync with validated secret, HS256 pinned.
- ROADMAP 0.6: `agent/backend-engineer/sig-cert-hardening` (cf18489). Signature must match `/^[0-9a-f]{64}$/` (closed trailing-garbage acceptance), `certSecret()` min 32.
Gate after merge on develop 9210d73: `pnpm --filter ./app/backend typecheck` exit 0, `lint` exit 0, `npx jest src test/unit --forceExit` 43 passed / 2 skipped suites, 207 passed / 69 skipped tests, 0 failed.
Follow-ups from review (next night): register Zarinpal request + callback routes in `PaymentsModule` with userId from verified JWT only, make `status` required in `PaymentsService.verify` (resolver path defaults to 'OK'), legacy `service/payment.service.ts` verifyPayment sends client amount (delete or route via provider), legacy `payments` table vs `"Payment"`, webhook replay protection, `booking.controller.ts:83` uses `PAYMENTS_WEBHOOK_SECRET`, e2e suites miss `body-parser`/`supertest` deps, env schema not wired into ConfigModule.
Not done tonight: frontend/mobile agents idle (backend P0 first).

### 2026-10-19 night (22:03–22:45 Tehran) — nightly session 1
Done (merged into `develop`, security-reviewer APPROVED, gates green):
- ROADMAP 0.3: `agent/backend-engineer/jwt-hardening` + `agent/backend-engineer/jwt-gaps`. JWT secrets ≥ 32 chars, fail-fast unless NODE_ENV is exactly development/test, HS256/RS256 pinned on every touched sign/verify, `alg:none`/HS512 rejected (tests), env schema validated in `main.ts` outside dev/test.
- ROADMAP 0.1 (partial): `agent/coordinator-architect/deploy-repoint`. 40 files, removed deploy manifests/values/bake targets/CI matrix for removed services, gateway helm gets `BACKEND_URL=http://armanfit-backend:80/graphql`. YAML parse OK, `docker compose config -q` OK.
- ROADMAP 0.8 (inventory): `agent/qa-test-engineer/mock-inventory` → `docs/agents/MOCK_INVENTORY.md`.
- ROADMAP 1.1: `agent/ui-ux-designer/design-tokens`. `packages/ui-tokens` typecheck OK, lint 0 errors, 3 suites / 14 tests passed (WCAG AA contrast asserted).
Gate after merge on develop 05b78d2: `pnpm --filter ./app/backend typecheck` exit 0, `lint` exit 0, `npx jest src test/unit --forceExit` 37 passed / 2 skipped suites, 136 passed / 69 skipped tests.
Not merged:
- `agent/backend-engineer/payments-real-provider` (pushed): green (140 tests) but CHANGES REQUIRED — `payment.provider.ts:78,84` verifies amount from client callback payload. Fix: expected amount from stored order by authority.
Follow-ups found by review: `common/security/webhook-signature.ts:26-30` skips HMAC whenever NODE_ENV≠production (P0, next night). `payments.controller.ts:27`→`payments.service.ts:79-85` marks paid without verify (not registered). `CERT_SECRET` min 16→32. env schema rejects NODE_ENV=staging. `services/graphql-gateway/src/main.ts` dead subgraph defaults. `domain.module` JwtModule has no secret.
Process note: Agent worktrees start from `main`, agents must `git checkout -B <branch> origin/develop` first (fixed mid-session by cherry-picking onto develop).

### 2026-10-19 — backend gate re-verified
- `scripts/agents/prisma-generate-offline.sh` → client generated. `pnpm --filter ./app/backend typecheck` 0 errors, `lint` exit 0, `test` 35 passed / 2 skipped suites, 115 passed / 69 skipped tests.

### 2026-10-19 — token-saving setup
- Vendored `caveman` skill (JuliusBrussee/caveman @ bad48a0, Apache-2.0) in `.claude/skills/caveman`.
- rtk (rtk-ai/rtk, Apache-2.0 edition) built from source in the sandbox in 4 m 43 s (`cargo build --release --no-default-features` OK, `rtk 0.49.0`). Release downloads are blocked here, so the runbook builds it in the background at session start.
- Token budget rules added to CLAUDE.md. Model tiers: coordinator + security-reviewer = opus, other 7 = sonnet, broad search = built-in Explore.

### 2026-10-19 — deprecated services removed
- `git rm` of 14 deprecated services + their deploy manifests. Check: no source imports into removed paths, `pnpm install` OK (45 s), typecheck shows 0 TS2307 missing-module errors (Prisma-client errors are the known blocker above).

### 2026-10-19 — setup
- Created `CLAUDE.md`, `.claude/agents/*` (9 agents), ROADMAP, STATUS, NIGHTLY_RUNBOOK on `develop`.
- Baseline taken from FINAL-CERTIFICATION.md (2026-07-10) and GUZARESH-NAHAEI.md (2026-06-29). Not re-verified tonight.
