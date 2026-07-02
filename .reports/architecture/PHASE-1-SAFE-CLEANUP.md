# Phase 1 — Safe Cleanup (report)

Branch `claude/project-completion-prompt-0y30ok`. Scope per owner instruction:
*"Remove only zero-risk placeholders, empty packages, noop stubs and proven dead
code. Do not delete any business logic yet. Keep CI/Build/TypeCheck/Tests green
after every commit."*

## What moved / was deleted, and why

| Removed | Kind | Evidence it is dead | Business logic lost? |
|---|---|---|---|
| `packages/graphql` (`@arman/graphql`) | Empty stub | `src/index.ts` = `export {};`; 0 code importers (grep for exact `@arman/graphql` — matches to `graphql-utils`/`graphql-dataloader`/`graphql-gateway` are different packages) | No |
| `packages/libs` (`@arman/libs`) | Empty stub | `src/index.ts` = `export {};`, `index.ts` = a version constant; 0 code importers (only stale report/sbom JSON mention it) | No |
| `packages/theme` (`@arman/theme`) | Empty stub | `src/index.ts` = `export {};`; `index.css` imported nowhere; real design system is `@arman/ui-tokens` + `@arman/ui-components` | No |
| `services/ml-service` | Noop stub | only `src/_noop.ts`; 0 references anywhere; Recommendation canonical is `predictive-service` (per ownership map §B) | No |

## Deliberately NOT deleted (looked dead by LOC, actually hold logic → deferred)

- `packages/auth` — React role-based auth context/`withRole` HOC (23 LOC). 0 importers
  but real logic; belongs to the **Auth** phase / frontend review.
- `packages/integrations/livekit` — LiveKit egress interfaces; belongs to the
  **Live-streaming** phase.
- `packages/contracts` — carries a security-bootstrap `main.ts` + Dockerfile;
  reassess during the gateway/infra stage.
- 11 other orphan libs from the inventory — kept pending their domain phase; deleting
  them now would risk removing referenced-but-not-yet-wired logic.

## Verification (green after this commit)

- Lockfile regenerated offline (`pnpm install --lockfile-only --offline`, exit 0);
  the three empty importer entries removed; 75 → 71 workspace projects.
- Dangling-reference sweep across all `*.ts`/`*.tsx`: clean.
- Toolchain sanity: `@arman/ui-tokens` and `@arman/utils` `tsc --noEmit` pass.
- No source file referenced any removed package → typecheck/build unaffected by
  construction (removed members had 0 importers).

## Technical-debt delta

- Closed: D5 (partial) — 4 of the dead components removed; 6 remain (deferred, see
  above) plus real orphan libs to be folded per domain.
- Unchanged: D1–D4, D6–D10 remain open (addressed in later phases).

## Next: Phase 2 — Canonical schema freeze
Finalize the canonical monolith domain model, freeze one Prisma schema, add missing
canonical models (Session, RefreshToken, Order, Plan*), generate clean migrations,
validate GraphQL/entities/DTOs against it. No duplicate deletions until their
domain's fold (Phase 3+).
