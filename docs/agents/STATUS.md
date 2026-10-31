# Arman Varzesh — status & deploy readiness

Maintained by `coordinator-architect`. Only verified facts. Newest session on top.

## Deploy readiness: ❌ NOT READY

| Gate | Status | Evidence (command / result) |
|---|---|---|
| Deploy path targets `app/backend` only | ⚠️ | 2026-10-21: graphql-gateway default subgraph = monolith `BACKEND_URL` (required outside dev/test), dead subgraph defaults + deploy templates removed, gateway tsc 0 / jest 39 passed. Open: `services/api-gateway/src/main.js` legacy proxy to removed services, `app/physio-subgraph` proxies removed physio-service, `helm template` not run |
| All P0 security items closed | ⚠️ | 2026-10-21: Zarinpal request (JWT userId only) + callback (stored amount, idempotent, status required, 302 to `PAYMENT_RESULT_URL`) registered, mock provider fails outside dev/test, legacy client-amount payment path deleted, P0-1 header trust: 0 sites in app/backend + services (grep) with regression tests, matching endpoints JWT + no coach PII. Open: Stripe webhook signature not re-verified, webhook replay protection, `main.ts` CORS allows all when `CORS_ORIGINS` empty, paid payment does not credit wallet yet |
| No mocks / stubs in production paths | ❌ | 2026-10-21 burn-down: P0 #1 #2 #3 #8 #9 #12 #13 fixed, P1 #4 #10 #14 #15 #16 #17 fixed (merged). Open P0: none of the 9 left as fake, but email (nodemailer missing) and web push fail explicitly. Open P1: #5 #11 #20 #22 #23 #25 #26 #30 #31, admin DashboardPage hard-coded stats, ReviewsService in-memory |
| Backend typecheck + lint + unit tests green | ✅ | 2026-10-21 night on develop 74818f9: typecheck exit 0, lint exit 0, `jest src test/unit --maxWorkers=2` 54 suites / 312 tests passed (2 suites, 69 tests skipped), 0 failed. Also green in CI backend-e2e run 39653155423 unit step |
| Backend e2e against real Postgres + Redis green | ✅ | 2026-10-24 22:02 package: backend-e2e green on develop 057f474 (run 40088977535: e2e 6 suites / 25 tests, unit 312 passed / 69 skipped, 0 failed). PR #61 head 902187e: e2e 26 passed (new concurrent-cancel test). Counts published as run annotations. Unrelated red checks on develop: integration (MinIO image pull), grype, trivy SARIF upload, Workers Builds |
| Real Prisma migrations, no `db push` | ⚠️ | 2026-10-21: 21 migrations apply cleanly with `migrate deploy` in CI and on a scratch Postgres 16 (reviewer). New additive migration `20261021000000_notifications_device_tokens`. Open: `migrate diff` schema-vs-migrations drift check not run (engine blocked in sandbox), remove remaining `db push` fallbacks (ROADMAP 0.5) |
| Web site + admin production builds green | ✅ | 2026-10-21: `pnpm --filter ./apps/admin-web build` exit 0 (jest 34 passed, typecheck 0) on develop 0e43b57, web-site build "Compiled successfully" (security-reviewer run on atoms branch) |
| Mobile user + coach typecheck + EAS preview build | ❌ | 2026-10-21: mobile-user typecheck 0 errors, jest 19 passed. eas.json not configured, coach app has no source |
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
| `PAYMENTS_WEBHOOK_SECRET`, `MEDICAL_WEBHOOK_SECRET` | HMAC of PSP payment and medical webhooks (now required in staging + production) | missing |
| `BOOKING_WEBHOOK_SECRET` (≥ 32 chars) | HMAC of outbox relay -> `POST /booking/payments/success`, fail-closed outside dev/test | missing |
| `ZARINPAL_MERCHANT_ID`, `PAYMENT_PROVIDER=zarinpal`, `ZARINPAL_CALLBACK_URL` (opt. `ZARINPAL_SANDBOX`) | payments | missing |
| `SMS_PROVIDER=kavenegar`, `KAVENEGAR_API_KEY`, `KAVENEGAR_SENDER`, `KAVENEGAR_OTP_TEMPLATE` (opt.) | OTP / SMS, prod boot fails without them | missing |
| `PAYMENT_RESULT_URL` (https) | page the Zarinpal callback redirects to, prod boot fails without it | missing |
| `EXPO_ACCESS_TOKEN` (optional) | Expo push API | missing |
| `ADMIN_USERS_JSON` | admin accounts for `POST /admin/login` | missing |
| `CORS_ORIGINS` | allowed web origins for backend, live socket and graphql-gateway | missing |
| `BACKEND_URL` | graphql-gateway → monolith, required outside dev/test | missing |
| `EXPO_PUBLIC_API_URL` / `VITE_API_BASE_URL` | mobile + admin-web backend base URL (build-time, not secret) | missing |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | media storage | missing |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | live sessions | missing |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | email (also needs `nodemailer` dependency, team task) | missing |
| AI provider API key | AI module | missing |
| Expo / EAS account + `EXPO_TOKEN` | mobile builds, push | missing |
| Apple Developer account (APNs key) | iOS push, TestFlight | missing |
| Google Play / Cafe Bazaar / Myket developer accounts + keystore | Android release | missing |
| Production domain + TLS, hosting/k8s access | deploy | missing |

## Owner decisions
- 2026-10-25: Owner set standing directives D0 (merge ready PRs at the end of every stage, all prompt rules respected), D1 (four separate claims, hooks, independent review, CI as merge condition) and D2 (documented cleanup of every tracked file). Text: `docs/agents/OWNER_DIRECTIVES.md`. Owner asked for no development in the session that recorded them, work continues in the scheduled packages.
- 2026-10-19: Team of 9 agents created. Nightly window 22:00–23:00 Tehran. Work lands on `develop`.
- 2026-10-19: Owner approved deleting the deprecated `services/*`. Done: 14 folders with `DEPRECATED.md` removed (affiliate, assessments, challenges, coaches, content, courses, inbox, kpis, medical, nutrition, payments, physio, rewards, users), plus their k8s manifests/secrets, `helm/users-service`, and entries in docker-bake, CI matrix, Prometheus, deploy/helm values, compose.elite. 11 active services remain.
- 2026-10-20: Owner set the Claude ↔ GPT collaboration protocol (`docs/agents/COLLABORATION_GPT.md`): GPT reviews daily 00:05 Tehran in a fixed GitHub issue, Claude answers every finding at shift start. Owner also instructed: no questions to him unless he asks, development continues without his approval even if he is offline.
- 2026-10-20: Owner extended the nightly window to three hours, 21:00–24:00 Tehran (scheduled task now fires 21:02).
- 2026-10-20: Owner made integration a standing duty every shift and granted permission to merge ready PRs (incl. `develop → main`), never bypassing branch protection. Responsibility ends at merge + target CI check. Assigned to `qa-test-engineer` (integration owner).
- 2026-10-20: Owner approved merging `develop` into `main` (PR #53, merge commit 828077f), deploy readiness still NOT READY.
- 2026-10-19: Owner delegated all technical decisions to the team (see CLAUDE.md «Decision authority»). He reviews nightly reports and sends guidance.

## Open items (2026-10-31 22:02 package)
- **PR #78** (REV-20261022-01 GraphQL part) head 9f84d56: resolver ownership tests (24 in the spec, red before fix 7 failed), fixes for non-existent columns `Reservation.createdAt`/`coachId` in queries, client `coachId` echoed back, `CreateAvailabilityInput` without validators, strict id parsing. `npx jest src/reservations` 34/0/0, typecheck exit 0, eslint 0 errors. Independent review (security-reviewer opus): CHANGES REQUIRED on f728910 (owner filter in the write untested, mutation M1 survived), fixed in 9f84d56, re-review APPROVED. Not merged at package end, see report for CI.
- **PR #76** head 4cee016: semgrep crash root cause is not memory. Last green scan used Python 3.14.8 + semgrep 1.182.0, crash started with Python 3.15.1 + 1.183.0 and also happened with `--jobs 1 --max-memory 4096`. Pinned to 3.14 + 1.182.0, cap removed. Review APPROVED.
- Follow-ups found in review (already on develop): cancelled reservation blocks rebooking the same slot (`@@unique(resourceId,startsAt,endsAt)`), `AvailabilitySlot` vs `Slot` split means admin-created availability cannot be booked, `MEMORY_DB` in-memory fallback in `ReservationService`.

## Open items (2026-10-30 22:02 package)
- **PR #64** head 8b3e650, ready for review: budget P3s fixed (3db22eb, red-before test), integration job MinIO removed (image no longer pullable, unused) and wait loops fail-closed (0460693, 8b3e650). Hook tests 35/0/0. Independent review APPROVED (security-reviewer opus, qa-test-engineer sonnet). CI 8b3e650: integration, backend-e2e, claude-hooks green. **Not merged:** grype (High, also red on develop), sast-semgrep (semgrep-core OOM), Workers Builds red. Next: triage grype + semgrep in own PR.
- **PR #75** (REV-20261025-02) head ad8dffe, ready: fixed instant + day-boundary test, jest 8/0/0, review APPROVED. Not merged: same red checks plus integration until #64 lands.
- REV-20261022-01 GraphQL part is open (the 10:02 reply wrongly said fixed, corrected in issue #54 comment 6530942565).

## Open items (2026-10-26 22:02 package)
- **PR #65 merged** into develop (merge 40bbe16): REV-20261021-05 fix. Evidence: CI run 40280993101 mobile job 27 passed on head 8f3124f, local typecheck 0 / jest 27 passed / eslint exit 0, independent review APPROVED. Red on PR and develop alike: integration (MinIO pull), scan (grype/trivy), Workers Builds.
- **PR #64** now at dfa48f0 (draft, not merged): 4 fix rounds tonight, hook tests 34 pass / 0 fail / 0 skip, independent re-review (security-reviewer opus, separate agent) APPROVED dfa48f0 for the reviewed fixes (comment 6424827044). Still blocking merge: original-review P1 worst-case Stop timeout (3600 s < 5 packages x 3 cmds x 300 s, needs a total time budget), CI on dfa48f0 was still running at package end. Open P2: success claims with words not covered ("Type checking succeeded", "LGTM"), `rm -rf $(echo .claude)`, unzip/tar into .claude, skipped tests pass silently, check configs unprotected, malformed stdin fails open.

## Open items (2026-10-25)
- **PR #64** (`agent/coordinator-architect/dod-hooks-ci`, draft, D1): hooks + CI gate + CLAUDE.md rules. Independent review (security-reviewer, opus): CHANGES REQUIRED, 1 P0 + 8 P1 findings posted on the PR. Not merged. Next package fixes them first after REV replies.
- **Branch protection:** `develop` and `main` have no protection, required checks or rulesets (reviewer, 2026-10-25). Owner action: require `backend-e2e` and `claude-hooks`.

## Open items (2026-10-24 22:02 package)
- **Quota observability not established.** Official in-app balance still unreadable from the scheduled run (`claude -p "/usage"` gives local cost only). Owner directive 2026-10-24 (CLAUDE.md «Quota budget») lets REV fixes continue, 20% reserve not claimed.
- **REV-20261021-01 (P1, gateway vs plain ApolloDriver)** and **REV-20261021-02 (P1, checkout to real gateway + entitlement):** not started.
- **GraphQL fail-closed (reported by Claude, not yet confirmed by GPT):** global ThrottlerGuard fails on GraphQL context. Needs a default-deny GraphQL JWT guard before the throttler is fixed.
- REV-20261021-05, 06, 07 and REV-20261022-01 evidence merged 2026-10-24 22:02 package, waiting for GPT's independent close.
- **PR #55** (`claude/chat-service-auth-hardening`, draft, target main): open, needs retarget to develop and a security review.
- `apps/web-site/pages/payments/checkout.tsx` and `src/lib/payments.ts` still send a fake `x-user-id: demo-web`, web checkout is not wired (REV-02 scope).

## Decisions log
| Date | Decision | Rationale |
|---|---|---|
| 2026-10-31 | semgrep pinned to Python 3.14 + semgrep 1.182.0, memory cap removed (PR #76) | Crash -11 started with the floating 3.15.1 + 1.183.0 and was not fixed by caps, a cap can skip files and still exit 0 |
| 2026-10-31 | Reservation queries reach the coach through `Slot` and order by `startsAt` (PR #78) | `Reservation` has no `createdAt`/`coachId` columns, both queries failed with a Prisma error |
| 2026-10-30 | MinIO removed from the integration job instead of swapping the image | Docker Hub and quay.io both refuse the pull, no step uses S3; real S3 adapter coverage must come with a test |
| 2026-10-30 | PR #64 not merged although review approved | grype, semgrep and Workers Builds red on the head SHA, GPT: red-before is no merge license |
| 2026-10-26 | Stop gate judges only overall success claims and claims about a check the gate reports FAIL/NOT_RUN, no word-list heuristics (PR #64 dfa48f0) | Three review rounds showed word lists either let false success through or blocked honest partial reports |
| 2026-10-26 | PR #65 merged with integration/scan/Workers red | Same checks red on develop, diff only in apps/mobile-user, mobile job + local lint green |
| 2026-10-24 | Legacy `POST /payments` retired instead of migrated (PR #63) | It wrote a table no migration creates and never started a gateway payment, the real start is `POST /payments/zarinpal/request` on `"Payment"` |
| 2026-10-24 | Mobile session writes and clears go through one ordered queue with a session generation (PR #62) | A generation check alone still let a refresh already inside its SecureStore writes land after sign-out |
| 2026-10-23 | Package with unreadable quota answers REVs and writes handoff only; no code | CLAUDE.md «Quota budget» rule; Speko billing tools are not Claude quota |
| 2026-10-22 | Owner quota plan: two packages per day (10:02, 22:02 Tehran, ≤60 min each), 80% project cap, 20% owner reserve, quota-stop rule when balance is unreadable | Team cost per full shift is too high for the five-hour reset; full text in GitHub issue #54 |
| 2026-10-22 | `docs/agents/reports/` was git-ignored (`.gitignore` rule `reports/`), so the 2026-10-21 report never reached develop; exception added | Handoff report must be in git to be reviewed |
| 2026-10-22 | Fallback slots 04:02 and 16:02 documented but not scheduled | Spend less until three days of measured data exist |
| 2026-10-21 | Owner: nightly window moves to 22:00–00:00 Tehran and is reduced to two hours (was 21:00–24:00) | Owner instruction; runbook updated, scheduled task moved to 22:02 |
| 2026-10-19 | Path A: `app/backend` monolith is production | Hardened, all gates green; services carried P0 defects |
| 2026-10-19 | Work lands on `develop`, `main` only via owner-approved release | Keeps production stable |
| 2026-10-19 | Merge only security-approved branches, payments branch held back | Reviewer found callback amount taken from client payload (underpay risk) |
| 2026-10-19 | Removed stale graphql-gateway subgraph env (users/coaches/nutrition/content) instead of pointing all four at the monolith | Four subgraphs on one schema would conflict, gateway gets `BACKEND_URL` |
| 2026-10-20 | Payment verify reads expected amount from `"Payment"` row by authority, conditional UPDATE for idempotency | Client callback amount cannot be trusted, race-safe single credit |
| 2026-10-20 | Webhook HMAC skip and secret fallbacks allowed only for NODE_ENV exactly development/test, `staging` is strict | Unset or unknown env must never disable verification |
| 2026-10-20 | Gateway business rejections (e.g. -51) not retried and not counted by circuit breaker | User cancels must not trip the breaker |
| 2026-10-20 | From the next shift `ui-ux-designer` (+ `web-frontend-engineer` / `mobile-engineer`) runs ROADMAP 1.2 and 1.3 every night in parallel with Phase 0 | Three-hour window allows it, design files do not overlap backend scope, and UI is the longest path to deploy |
| 2026-10-20 | `qa-test-engineer` is the integration owner | Already owns CI and test suites, keeps coordinator free for planning |
| 2026-10-21 | Push goes only through Expo push API, FCM/APNs no-op providers deleted | App is Expo, one real path beats three empty ones |
| 2026-10-21 | Zarinpal callback 302-redirects to `PAYMENT_RESULT_URL`, JSON only for `Accept: application/json` | Browser redirect from the gateway needs a page, target only from env (no open redirect) |
| 2026-10-21 | A forged `Status=NOK` may flip pending→failed, a later verified OK still settles | Reviewer judged low impact, gateway verify with stored amount stays the authority |
| 2026-10-21 | Admin roles in admin-web decoded from JWT for UI only, backend guards enforce, `GET /admin/me` added | Admin table has no role column, admins come from `ADMIN_USERS_JSON` |
| 2026-10-21 | Mobile tokens in expo-secure-store, auth is email + password (REST /auth/*) | Backend has no OTP endpoints yet, GraphQL login returns no refresh token |
| 2026-10-21 | PR #52 closed as superseded, its live security fixes ported in a99b68d/91a5266 | 145 of 163 files target removed services, 41 conflicts |
| 2026-10-21 | physio dropped from gateway default subgraphs | `app/physio-subgraph` only proxies the removed physio-service |
| 2026-10-19 | Open: iOS distribution path for Iran — coordinator decides in a later session | Needs research on Sibche / TestFlight / PWA |

## Integration (PR sweep, updated every shift)
| PR | Target | State | Blocker / action |
|---|---|---|---|
| #52 claude/project-review-improvement → main | main | closed 2026-10-21 (superseded) | Still-relevant fixes ported to develop (webhook guard fail-closed, live socket + gateway CORS allowlists). Follow-up: api-gateway CORS allowlist or retire api-gateway |
| develop → main release | main | not opened tonight | develop 74818f9 green locally, but backend-e2e not yet green in CI and deploy gates red. Action: open release PR when backend-e2e passes |
| #53 develop → main | main | merged 828077f | — |
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
### 2026-10-31 22:02 package (22:02 Tehran, scheduled) — REV-20261022-01 GraphQL, semgrep root cause
- Quota before and after: unreadable from an official in-app source. One implementing agent (backend-engineer opus) plus coordinator fixes, one separate reviewer.
- Details, tests and CI: `docs/agents/reports/2026-10-31.md` section 22:02.
### 2026-10-30 10:02 package (10:02 Tehran, scheduled) — REV replies, PR #64 status, handoff
- Quota before and after: unreadable from an official in-app source. No implementing agent started.
- REV replies posted on issue #54 (comment 6516585452). Fixed by merged PR or commit (not re-run this package): REV-03 (PR #56), 04 (PR #58), 05 (PR #65), 06 (PR #60), 07 (PR #63), REV-22-01 (PR #57), REV-24-01 (PR #59). Open, not started: REV-21-01, 02, 24-02, 25-01 (partly addressed by the handoff), 25-02.
- PR #64 head `64160db`: hook tests 35 pass / 0 fail / 0 skip (worktree). CI: backend-e2e and claude-hooks green, integration and Workers Builds red. Not merged: draft, integration red on the exact head, two P3 open. Handoff: `docs/agents/reports/2026-10-30.md`.
- Owner-only: branch protection on develop and main not applied.

### 2026-10-28 10:02 package (10:02–11:02 Tehran) — PR #64 budget fix, review, handoff
- Quota before and after: unreadable from an official in-app source. No new development beyond one REV-independent finding on PR #64.
- PR #64 `64160db` (draft, not merged): total run budget for the Stop gate (`totalBudgetSec`, capped at 3300 s, below the 3600 s Stop hook timeout). Hook tests 35 pass / 0 fail / 0 skip locally. Independent review (security-reviewer, opus, separate agent) on `1d85fe6`: APPROVED, no P0-P2, four P3; two fixed in `64160db`, two open. CI on `64160db` not reported in this package.
- Not done: REV-20261021-01, 02, REV-20261022-01 (GraphQL), REV-20261024-02, REV-20261025-01/02. Handoff: `docs/agents/reports/2026-10-28.md`.

### 2026-10-27 10:02 package (10:02 Tehran, scheduled) — review answers + handoff only
- Quota before and after: unreadable from an official in-app source. No code changed, no tests run, no merge, no deploy.
- Issue #54: answered every open REV (comment 6435431906). REV-01, 02, REV-24-01 and REV-25-02 accepted, not started. REV-21-03 to 07 and REV-22-01 evidence merged, waiting for GPT close. REV-24-02 and REV-25-01 on PR #64.
- PR #64 (`dfa48f0`, draft): not merged. Blocker: worst-case Stop timeout P1 from the first review. CI on dfa48f0: integration, scan and Workers Builds red, same as develop.
- Handoff: `docs/agents/reports/2026-10-27.md`.

### 2026-10-24 22:02 package (22:02–23:00 Tehran) — REV-05, 06, 07 fixed, REV-22-01 evidence
- Quota before and after: unreadable from an official in-app source (`claude -p "/usage"` gives local cost only). Owner directive 2026-10-24 applies: REV fixes continue, at most two implementing agents, 20% reserve not claimed.
- Merged into develop: #61 (REV-20261022-01 concurrent owner cancel e2e, squash 7dd4b1b, CI e2e 26 passed), #60 (REV-20261021-06 Zarinpal deadline covers body, squash 53fe8f2, security review: code correct, test margins widened, CI unit 316 passed / 69 skipped, e2e 25 passed).
- Also merged: #62 (REV-20261021-05 mobile refresh race, security review APPROVED, squash fa073bc, CI mobile-user job green), #63 (REV-20261021-07 retire legacy POST /payments, security review APPROVED, squash 5dd36bd, CI e2e 28 passed, unit 310 passed / 69 skipped).
- Local gate on develop 5dd36bd: backend typecheck 0, lint 0, unit 53 suites / 310 passed / 69 skipped / 0 failed. mobile-user typecheck 0, jest 24 passed.
- Open: REV-20261021-01, REV-20261021-02, GraphQL fail-closed finding, PR #55. Handoff: `docs/agents/reports/2026-10-24.md` (22:02 section). develop after code merges 5dd36bd.
### 2026-10-24 13:53 package (13:53–14:53 Tehran, owner directive) — REV fixes merged
- Owner directive replaced the quota stop rule (CLAUDE.md «Quota budget»). Quota still unreadable, 20% reserve not claimed.
- Merged into develop: #56 (REV-20261021-03), #59 (REV-20261024-01), #58 (REV-20261021-04, proven red on deliberate build and test failures), #57 (REV-20261022-01). develop 76cedd9. backend-e2e on #57 head 0f97a0a: unit 312 pass / 69 skipped / 0 fail, e2e 25 pass / 0 fail.
- New findings for GPT: GraphQL fails closed in ThrottlerGuard (opening it needs a default-deny GraphQL JWT guard first), undecorated GraphQL inputs rejected by the global pipe, reservation list queries use non-existent columns.
- Open: REV-20261021-01, 02, 05, 06, 07, PR #55. Handoff: `docs/agents/reports/2026-10-24.md`.
### 2026-10-24 10:02 package (10:02–10:20 Tehran) — quota-blocked, review answer + handoff only
- Quota before and after: unreadable from an official in-app source. Speko usage tools show another vendor's account, not Claude quota. No new development.
- Issue #54: new finding REV-20261024-01 (P2, Playwright runner `ubuntu-latest` fails browser install on Ubuntu 26.04). Accepted, fix planned (pin runner, prove browser install + real test run), blocked by quota. All REV-20261021-01…07 and REV-20261022-01 still open.
- Handoff: `docs/agents/reports/2026-10-24.md`. No code changed, no tests run (docs only), no merge, no deploy.
### 2026-10-23 22:02 package (22:02–22:10 Tehran) — quota-blocked, delta reply + handoff only
- Quota before and after: unreadable (`claude -p "/usage"` re-checked 22:03, local cost only). No new development.
- Issue #54: no new GPT finding since 2026-10-22T20:36Z. Short delta reply ([comment](https://github.com/rahilsoft/armanvarzesh-v132/issues/54#issuecomment-6372050061)), REV statuses unchanged.
- CI on develop a2d5d81 (metadata): backend-e2e, Trivy, grype, CI Integration Services failure, rest success. No code changed, no tests run, no merge, no deploy.
### 2026-10-23 10:02 package (10:02–11:02 Tehran) — quota-blocked, review answers + handoff only
- Quota before and after: unreadable from an official source. No in-app usage tool in this run; Speko billing tools show another vendor's account. No new development.
- Issue #54: answered REV-20261022-01 and REV-20261021-01…07 ([comment](https://github.com/rahilsoft/armanvarzesh-v132/issues/54#issuecomment-6359006004)). All open, all blocked by quota observability except REV-03 (open on PR #56).
- Verified on develop 49dc13f: `ci-matrix.yml:19-20` still has `|| true`; `checkout.service.ts:56` still has `pay.example`.
- CI on 49dc13f (metadata): CI Matrix, gitleaks, trufflehog success; Trivy, CI Integration Services, grype failure. Logs not reviewed this package.
- Handoff: `docs/agents/reports/2026-10-23.md`. No code changed, no tests run (docs only), no merge, no deploy.
### 2026-10-22 22:02 package (22:02–22:20 Tehran) — quota-blocked, review answers + handoff only
- Quota before and after: unreadable from an official source (method above). No new development.
- Issue #54: replied to REV-20261021-01…07 and REV-20261022-01 ([comment](https://github.com/rahilsoft/armanvarzesh-v132/issues/54#issuecomment-6348313301)). All accepted, P1/P2 blocked by quota observability, REV-03 fixed on PR #56 (not merged).
- Docs: runbook title and COLLABORATION_GPT GPT slots corrected (GPT-DOC-CHECK leftovers).
- No code changed, no tests run (nothing to test), no merge, no deploy.
### 2026-10-21 night (21:02–04:25 Tehran, report pushed late) — nightly session 3
Report pushed at 04:25 Tehran, after the 23:55 deadline. Owner then changed the window to 22:00–00:00 and two hours.
GPT review issue «Independent technical review — GPT / Claude handoff» does not exist yet (searched open + closed issues), no REV findings to answer.
Round 1 (merged 76178ca), round 2 (merged 0e43b57), round 3 (merged 74818f9). Every branch security-reviewer APPROVED before merge, reviewer fixes pushed on the branches:
- ROADMAP 0.4 / MOCK #1–#4: `payments-routes` (2b9206e) Zarinpal request (JWT userId, whitelisted body, throttle 10/min) + public callback (stored amount, idempotent, status required), mock provider fails outside dev/test, legacy client-amount path deleted, booking webhook own `BOOKING_WEBHOOK_SECRET`. `payments-followups` (2c793c1) callback 302 to `PAYMENT_RESULT_URL`, NOK → failed (paid never downgraded), amount 10,000–500,000,000 Rial integer, dead resolver/webhook controller deleted.
- MOCK #8–#10: `notifications-real` (6020141) Expo push provider, Kavenegar over HTTPS, no fake success, no body logging. `notifications-wiring` (b671dc6) DeviceToken + NotificationLog models + migration `20261021000000_notifications_device_tokens` (applied on scratch Postgres 16 by reviewer), BullMQ queue + processor registered, NotificationsModule in AppModule, JWT device-token endpoints, unauthenticated /send + /preferences removed. `redis-lifecycle` (9e1562c) retryable failures retried by BullMQ, Redis clients closed on shutdown.
- ROADMAP 0.2 + MOCK #12: `matching-p0-1` (474e2d6) deterministic scoring, header-trust regression tests (0 sites left). `matching-pii-admin-me` (b8596fb) matching needs JWT, PublicCoach without email, verified only, `GET /admin/me`.
- ROADMAP 0.7: `ci-db-harness` (518492a) `backend-e2e.yml`, `e2e-ci-fix` (e70bf1a) hang fix + timeouts, ci-integration-services MinIO start fixed.
- ROADMAP 0.1: `gateway-repoint` (0f90c59). PR #52 port: `pr52-port` (91a5266).
- MOCK #13 #17: `real-auth` (0c713bc) mobile login/register real REST, single-flight refresh, Apollo 401 refresh. `secure-store` (286008b) tokens in expo-secure-store. `review-nits` (5ac536d).
- MOCK #14–#16: `admin-rbac` (5eba81c), `admin-login` (e5ab4e3) real `POST /admin/login`, deny-by-default route guard, safe redirect.
- ROADMAP 1.2 / 1.3 (partial): `atoms-and-specs` (a7e1070) 8 atoms + Persian/Jalali format utils + 9 screen specs in `docs/design/`, `molecules` (d84ed95) 8 molecules, dark `borderStrong` ≥ 3:1.
Gate on develop 74818f9 (local): backend typecheck 0, lint 0, `jest src test/unit --maxWorkers=2` 54 passed / 2 skipped suites, 312 passed / 69 skipped tests. admin-web typecheck 0, jest 34 passed, build 0 (at 0e43b57). mobile-user typecheck 0, jest 19 passed. ui-components jest 90 passed. graphql-gateway tsc 0, jest 39 passed.
CI: backend-e2e run 39653155423 (76178ca) migrate deploy + unit green, e2e step hung → cancelled. Fix merged, verification pending on the next run.
Not done / follow-ups: wallet credit on paid (needs `Payment.purpose` column + migration), Stripe signature re-check, CORS fail-open when `CORS_ORIGINS` empty, email needs `nodemailer`, NotificationsService.send has no callers yet, NotificationsResolver unregistered (client userId), admin DashboardPage fake stats, admin pages not routed, api-gateway legacy proxy, ReviewsService in-memory, RN component equivalents, Figma frames, eas.json.
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
