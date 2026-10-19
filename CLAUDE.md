# Arman Varzesh (آرمان ورزش) — instructions for Claude and the agent team

Owner: Roozbeh (حسین امامی), Rayan Rahil Iranians. Owner works from an iPhone only, so every
result must be reachable from GitHub / the Claude app (PRs, status files, notifications).

## Product
Persian fitness platform (formerly «آسان ورزش», live since 2021) being rebuilt as a monorepo.
Users, coaches, admins. Modules: workouts & WorkoutSession, nutrition, wallet/payments,
AI (coach, plans, predictions), admin panel, affiliate + referral, VIP club, AI coach matching,
chat, live sessions (LiveKit), challenges/rewards/gamification (XP, badges), courses, medical/physio.

## Canonical topology (Path A — monolith is production)
- `app/backend` — NestJS 11 + GraphQL + Prisma 5 (PostgreSQL) + Redis + BullMQ. **This is the
  production backend.** Schema: `app/backend/src/database/prisma/schema.prisma`.
- `apps/web-site` — public site, Next.js 15.
- `apps/admin-web` — admin panel, Vite 6 + React 18 + Ant Design 5.
- `apps/mobile-user` — user app, Expo 51 / React Native 0.74, React Navigation 6, Apollo, Zustand.
- `mobile/coach` — coach app (Expo), `app/ios` + `app/android` — fastlane lanes.
- `packages/*` — shared libs (auth, ui-tokens, ui-components, contracts, observability, …).
- `services/*` — 11 remaining legacy services (ai, analytics, chat, notifications, …). Do **not** add features there.
  Port anything still needed into `app/backend`. (14 deprecated services were removed on 2026-10-19.)
- Known audit: `FINAL-CERTIFICATION.md` + `MASTER-REMEDIATION-PLAN.md` (P0 security items).

## Non-negotiable rules
1. **Everything must really work.** No mocks, fake data, `TODO`-returning stubs or placeholder
   handlers in production paths. Every feature talks to the real provider through an adapter:
   payments Zarinpal (primary, Iran) with Stripe optional, SMS Kavenegar, storage S3/MinIO,
   live video LiveKit, push via Expo Notifications, email SMTP. Test doubles live in tests only.
   When a real provider needs credentials that are not in the environment, implement the real
   integration fully, read the secret from env, fail fast with a clear error, and list the missing
   secret in `docs/agents/STATUS.md` → «Secrets needed». Never invent keys, never commit secrets.
2. Security first: identity only from verified JWT (no trusted `x-user-id` headers), required
   secrets in production, signed webhooks, rate limits, input validation, RBAC on admin APIs.
3. Persian (fa-IR) and RTL are first-class: Jalali dates in UI, Persian digits in UI text,
   Vazirmatn font. In any Persian text never use the semicolon «؛», use «،» instead.
4. Work on branch `develop`. Never push to `main`. `main` changes only when the owner approves a
   release PR from `develop`.
5. Every change ships with tests and must pass: typecheck, lint, unit tests for the touched
   package(s). Do not merge red work into `develop`; leave it on its own branch and report it.
6. Small, reviewable commits with Conventional Commit messages.
7. Keep `docs/agents/STATUS.md` truthful: only claim what was verified by running it.

## Decision authority (owner delegated 2026-10-19)
The owner delegated technical and product-implementation decisions to the team. The
`coordinator-architect` decides on its own — architecture, priorities, libraries, UX choices,
distribution paths, refactors, removals of dead code — and records every decision with a one-line
rationale in `docs/agents/STATUS.md` → «Decisions log». The owner reviews the nightly report and
sends guidance, which overrides earlier decisions.
Still require the owner: merging to `main` / production deploy, spending money or creating paid
accounts, entering or changing secrets, anything legal (store policies acceptance, contracts).

## Commands
- Install: `pnpm install` (pnpm 10, Node from `.nvmrc`).
- Backend: `pnpm --filter ./app/backend typecheck | lint | test | build`.
- Prisma: `pnpm --filter ./app/backend exec prisma generate --schema src/database/prisma/schema.prisma`.
- Web: `pnpm --filter ./apps/web-site build`, admin: `pnpm --filter ./apps/admin-web build`.
- Mobile: `pnpm --filter ./apps/mobile-user typecheck`; builds via EAS (cloud) — owner has no Mac.

## Token budget rules (all agents)
1. **caveman voice** (`.claude/skills/caveman`) for inter-agent reports, status lines and
   narration between tool calls. Not for code, commits, docs, STATUS.md or owner messages.
2. **rtk** for noisy commands when installed (`command -v rtk`): `rtk pnpm …`, `rtk tsc`,
   `rtk jest`, `rtk lint`, `rtk prisma …`, `rtk next build`, `rtk git status|diff|log`,
   `rtk test <cmd>`, `rtk err <cmd>`. Without rtk: pipe through `| tail -n 40` or `grep -E "error|fail"`.
3. Broad search → built-in `Explore` subagent (cheap model), answer as `path:line-range reason`
   lines only. Read files by line range, never whole large files or lockfiles.
4. Subagent final report ≤ 25 lines: branch, files changed, commands + pass/fail counts,
   blockers. No pasted logs or diffs.
5. Never paste generated files, lockfiles, or full test logs into context.

## The agent team
Definitions live in `.claude/agents/`. Nightly procedure: `docs/agents/NIGHTLY_RUNBOOK.md`.
Backlog: `docs/agents/ROADMAP.md`. Progress and deploy readiness: `docs/agents/STATUS.md`.
