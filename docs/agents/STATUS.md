# Arman Varzesh — status & deploy readiness

Maintained by `coordinator-architect`. Only verified facts. Newest session on top.

## Deploy readiness: ❌ NOT READY

| Gate | Status | Evidence (command / result) |
|---|---|---|
| Deploy path targets `app/backend` only | ⚠️ | 2026-10-19 night: helm/deploy/k8s/CI/compose/bake no longer reference removed services (grep empty). Open: `services/graphql-gateway/src/main.ts` still defaults to dead subgraphs, `helm template` not run (no helm in sandbox) |
| All P0 security items closed | ❌ | 2026-10-19 night: P0-2/P0-3 (JWT) closed and approved. Open: payment amount verify (branch `agent/backend-engineer/payments-real-provider`, CHANGES REQUIRED), webhook HMAC bypass outside production, P0-1 sweep |
| No mocks / stubs in production paths | ❌ | inventory done: `docs/agents/MOCK_INVENTORY.md` 68 sites (9 P0, 18 P1, 41 P2), burn-down not started |
| Backend typecheck + lint + unit tests green | ✅ | 2026-10-19 night on develop 05b78d2: typecheck exit 0, lint exit 0, 37 suites / 136 tests passed (2 suites, 69 tests skipped), 0 failed |
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
| `CERT_SECRET` | course certificates signing | missing |
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
- 2026-10-19: Owner delegated all technical decisions to the team (see CLAUDE.md «Decision authority»). He reviews nightly reports and sends guidance.

## Decisions log
| Date | Decision | Rationale |
|---|---|---|
| 2026-10-19 | Path A: `app/backend` monolith is production | Hardened, all gates green; services carried P0 defects |
| 2026-10-19 | Work lands on `develop`, `main` only via owner-approved release | Keeps production stable |
| 2026-10-19 | Merge only security-approved branches, payments branch held back | Reviewer found callback amount taken from client payload (underpay risk) |
| 2026-10-19 | Removed stale graphql-gateway subgraph env (users/coaches/nutrition/content) instead of pointing all four at the monolith | Four subgraphs on one schema would conflict, gateway gets `BACKEND_URL` |
| 2026-10-19 | Open: iOS distribution path for Iran — coordinator decides in a later session | Needs research on Sibche / TestFlight / PWA |

## Known blockers
- Sandbox cannot download Prisma engines (`binaries.prisma.sh` → 403). **Solved for types:** `scripts/agents/prisma-generate-offline.sh` generates the client with placeholder engines, enough for typecheck + unit tests. Still open: runtime / e2e against a real DB need real engines → run those on GitHub Actions CI.
- `helm/graphql-gateway/values.yaml` still federates subgraph URLs of removed services (users, coaches, nutrition, content). Repoint to `app/backend` in ROADMAP 0.1.

## Session log
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
