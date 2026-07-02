# Phase 4 — Users domain: migration report

Branch `claude/project-completion-prompt-0y30ok`. Canonical: **modular monolith,
Int PKs** (`app/backend/src/users`, already the richer implementation).

## Artifact classification (users-service)

| Artifact | Class | Action |
|---|---|---|
| `UsersService` CRUD (findAll/findOne/findByEmail/create/update/delete) | Duplicate | Monolith already had it — no port needed |
| `User.age/gender/height/weight/goals/fitnessLevel` | Canonical (unique data) | **Folded** into canonical `User` |
| GraphQL resolver / DTOs | Duplicate | Monolith equivalents kept |
| service bootstrap (main/tracing/metrics/health) | Legacy infra | Retired with the service |

## What moved / changed

- Canonical `User` schema gained `age Int?`, `gender String?`, `height Float?`,
  `weight Float?`, `goals String?`, `fitnessLevel String?`.
- **Bug fixed (data loss):** the monolith `UsersService.create` accepted a
  `CreateUserInput` carrying these profile fields but only persisted
  `{email,name,password}` — the rest were silently dropped. `create`/`update`
  now persist them via a whitelisted `pickUserFields` (which also prevents
  arbitrary keys reaching Prisma).
- `User` GraphQL entity now exposes the profile fields; `role` corrected to
  nullable (matches schema `String?`, avoids a null-on-nonnull runtime error).
- Removed a `create(input as any)` cast in the resolver — now type-safe against
  the new `UserWriteInput`.

## Verification (this commit)

- **Typecheck:** `app/backend` `tsc -p tsconfig.build.json --noEmit` → exit 0
  against the regenerated canonical client.
- **Unit tests:** `src/users/__tests__/users.service.spec.ts` — 3/3 (profile
  fields persisted on create; partial update; unknown-key rejection). Full auth
  suite still green (10/10 combined).

## Staged (gated) — not done here

Physical retirement of `services/users-service` pending CI runtime validation +
gateway/compose rewire (`USERS_URL`, `USERS_SERVICE_URL`). See
`services/users-service/DEPRECATED.md`. Tracked as follow-up **USERS-RETIRE**
alongside **AUTH-RETIRE**.

## Technical-debt delta

- Fixed a real data-loss defect in the canonical Users write path.
- Removed one `as any`.
- Follow-ups: USERS-RETIRE (infra), and the monolith `users` vs `user`
  (singular) module duplication to reconcile in a later pass.
