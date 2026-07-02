# Phase 4 — Gamification domain: migration report

Branch `claude/project-completion-phase-next`. Canonical: **modular monolith,
Int PKs**, new `app/backend/src/gamification` module (independently
extractable seam per the owner's Gamification decision: module exports +
`/gamification` REST only; no cross-domain internal imports).

## Artifact classification (4 services folded in one domain cycle)

| Service | Artifact | Class | Action |
|---|---|---|---|
| rewards-service | PointEvent/Badge/UserBadge/Streak/VipTier/Referral/ReferralUse/Commission models + points/badges/streaks/VIP/referral/commission logic | **Canonical (unique)** — the only Prisma-backed implementation | Folded: models (String ids → Int PKs, FKs to User) + typed `RewardsService` |
| challenges-service | Challenge/ChallengeParticipant Prisma schema (rules/reward/window/progress) | Canonical (unique shape) | Folded into canonical `Challenge` (extended in place; legacy `duration` kept in sync) + new `ChallengeParticipant` |
| challenges-service | `ChallengesService` logic | **Stub** — in-memory arrays; never touched its own Prisma models | Re-implemented DB-backed (`ChallengesService`: create/join-idempotent/points/complete/leaderboard) |
| vip-service | whole service | **Stub/Duplicate** — in-memory; subsumed by `VipTier` + `myVipStatus` | Not ported |
| affiliate-service | whole service | **Stub/Duplicate** — in-memory; subsumed by `Referral`/`ReferralUse`/`Commission` | Not ported |

## Schema & migration

- Canonical schema **54 → 63 models**: `ChallengeParticipant`, `PointEvent`,
  `Badge`, `UserBadge`, `Streak`, `VipTier`, `Referral`, `ReferralUse`,
  `Commission`; `Challenge` extended (rules/reward/startAt/endAt + window
  index). FKs to `User` throughout (impossible in the isolated service DBs).
- Migration `20260702000004_gamification_domain_fold/migration.sql`
  (166 lines, `prisma migrate diff` from the saved pre-fold schema).

## Port quality changes

- Injected `PrismaService` (removes another rogue `new PrismaClient()`).
- rewards-service's blanket `catch {}` around unique-key inserts swallowed
  **every** error (a DB outage would read as success); now only `P2002`
  unique violations are treated as idempotent-ok, everything else rethrows.
- Duplicate point events no longer bump the streak (original bumped the
  streak even when the event was a duplicate — double-count bug).
- `useReferral` for an already-counted invitee now short-circuits before
  awarding points/commission (original awarded commission on every call).
- Leaderboard is indexed (`@@index([challengeId, points])`).

## Verification (this commit)

- `npm run typecheck` → exit 0 (client regenerated, 63 models)
- `npm run lint` → exit 0
- `npm test` → 23 suites / 76 tests green (7 new)

## Staged (gated)

**GAMIFICATION-RETIRE** ×4 services after CI runtime validation + infra
rewire (compose/k8s/prometheus references to the four services).

## Technical-debt delta

- Closed: 4 duplicate/stub services superseded by one canonical module; two
  real defects fixed (swallowed errors, double rewards); one more rogue
  PrismaClient removed.
- LeaderboardEntry (global XP board) unchanged — already canonical.
