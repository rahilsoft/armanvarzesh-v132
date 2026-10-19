# Arman Varzesh — status & deploy readiness

Maintained by `coordinator-architect`. Only verified facts. Newest session on top.

## Deploy readiness: ❌ NOT READY

| Gate | Status | Evidence (command / result) |
|---|---|---|
| Deploy path targets `app/backend` only | ❌ | baseline: FINAL-CERTIFICATION.md §Deploy |
| All P0 security items closed | ❌ | 6 open (MASTER-REMEDIATION-PLAN.md) |
| No mocks / stubs in production paths | ❌ | sweep not done yet (ROADMAP 0.8) |
| Backend typecheck + lint + unit tests green | ✅ baseline | certification 2026-07-10: 115 passed |
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
| `DATABASE_URL` (production PostgreSQL) | backend | missing |
| `REDIS_URL` | cache, BullMQ | missing |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (≥ 32 chars) | auth | missing |
| `ZARINPAL_MERCHANT_ID` | payments | missing |
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
- Pending: iOS distribution path for Iran (TestFlight / Sibche / PWA).

## Known blockers
- Sandbox cannot download Prisma engines (`binaries.prisma.sh` → 403), so `prisma generate` fails and backend typecheck shows ~479 errors that are all caused by the missing generated client (0 missing-module errors). Fix: provide an engines mirror (`PRISMA_ENGINES_MIRROR`) reachable from the sandbox, or vendor the engine binaries, or verify on GitHub Actions. Until then agents must verify Prisma-dependent code on CI.
- `helm/graphql-gateway/values.yaml` still federates subgraph URLs of removed services (users, coaches, nutrition, content). Repoint to `app/backend` in ROADMAP 0.1.

## Session log
### 2026-10-19 — deprecated services removed
- `git rm` of 14 deprecated services + their deploy manifests. Check: no source imports into removed paths, `pnpm install` OK (45 s), typecheck shows 0 TS2307 missing-module errors (Prisma-client errors are the known blocker above).

### 2026-10-19 — setup
- Created `CLAUDE.md`, `.claude/agents/*` (9 agents), ROADMAP, STATUS, NIGHTLY_RUNBOOK on `develop`.
- Baseline taken from FINAL-CERTIFICATION.md (2026-07-10) and GUZARESH-NAHAEI.md (2026-06-29). Not re-verified tonight.
