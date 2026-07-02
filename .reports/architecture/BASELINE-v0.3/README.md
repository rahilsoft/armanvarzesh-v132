# v0.3-architecture-baseline

Checkpoint taken **before the Workout fold** begins. Tag
`v0.3-architecture-baseline` marks this commit as the rollback point: if the
Workout fold goes wrong, `git reset/revert` to this tag restores a state where
backend typecheck is green and all 16 folded-domain unit tests pass.

Verified at this baseline (in-sandbox):
- `app/backend` `tsc -p tsconfig.build.json --noEmit` → exit 0
- 16/16 unit tests across Auth (7), Users (3), Payments (6)
- Canonical schema: 46 models, client regenerated offline

| Document | Contents |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Updated architecture diagram (target vs current), strangler seams, deploy truth table |
| [OWNERSHIP-STATUS.md](./OWNERSHIP-STATUS.md) | Domain ownership map with per-domain fold status |
| [ERD.md](./ERD.md) | Canonical Prisma ERD (mechanically generated) + non-canonical schema register |
| [RETIREMENT-MATRIX.md](./RETIREMENT-MATRIX.md) | Per-service G1–G4 retirement gates and blocking references |
| [TECH-DEBT-DELTA.md](./TECH-DEBT-DELTA.md) | D1–D10 movement since Phase 1; new tracked debt D11–D16 |
| [DOMAIN-DEPENDENCY-GRAPH.md](./DOMAIN-DEPENDENCY-GRAPH.md) | Business-domain dependency graph (FK/event-derived) + package graph refresh |
| [ADR-INDEX.md](./ADR-INDEX.md) | ADR-B1…B8 from this program + pre-existing ADR inventory (3 scattered dirs) |
| [READINESS.md](./READINESS.md) | Production-readiness scores: Auth 68, Users 62, Payments 55 |

Prior stage reports: `../STAGE-1-ARCHITECTURE.md`, `../STAGE-1-TECH-DEBT.md`,
`../DOMAIN-OWNERSHIP.md`, `../PHASE-1-SAFE-CLEANUP.md`,
`../PHASE-3-AUTH-MIGRATION.md`, `../PHASE-4-USERS-MIGRATION.md`,
`../PHASE-4-PAYMENTS-MIGRATION.md`.
