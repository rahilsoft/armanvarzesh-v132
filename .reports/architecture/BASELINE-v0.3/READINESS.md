# Production readiness — completed domains, v0.3 baseline

Rubric (weights): Canonical schema 15% · Logic quality 20% · Unit tests 15% ·
Wired HTTP/GraphQL surface 15% · Integration/E2E vs real infra 20% ·
Deploy/infra alignment 15%. Scores are evidence-based; "verified in this
sandbox" means typecheck + unit tests; runtime claims are CI-gated.

## Auth — 68 / 100

| Criterion | Score | Evidence |
|---|---|---|
| Canonical schema | 15/15 | Session/RefreshToken/Device/PasswordResetToken, Int FKs, regenerated client |
| Logic quality | 18/20 | Ported hardened impl (argon2, rotation, theft detection, constant-time login, jti). −2: TOTP/password-reset services from auth-service not yet ported |
| Unit tests | 13/15 | 7 tests incl. theft-detection family-revoke; no controller-level test |
| Wired surface | 12/15 | `UserAuthModule` in `app.module`; `/auth/register|login|refresh` + throttling. −3: no logout/blacklist endpoint wired |
| Integration/E2E | 4/20 | None run vs real Postgres yet (CI-gated) |
| Deploy alignment | 6/15 | Monolith deployed in prod compose, but dev compose/k8s still route auth traffic to DEPRECATED service |

## Users — 62 / 100

| Criterion | Score | Evidence |
|---|---|---|
| Canonical schema | 15/15 | Profile fields folded; single canonical User |
| Logic quality | 16/20 | Whitelisted write path, data-loss bug fixed. −4: no pagination, no soft-delete policy, `delete` is hard-delete |
| Unit tests | 11/15 | 3 tests (persistence, partial update, key whitelist); thin on query paths |
| Wired surface | 12/15 | UsersModule + GraphQL resolver in monolith. −3: mutations unguarded (no auth on createUser/deleteUser) |
| Integration/E2E | 4/20 | CI-gated |
| Deploy alignment | 4/15 | Gateway still composes users-service subgraph |

## Payments — 55 / 100

| Criterion | Score | Evidence |
|---|---|---|
| Canonical schema | 14/15 | 5 models folded, PSP ids preserved; −1 D14 dual-profile Subscription |
| Logic quality | 17/20 | Idempotent webhook, outbox decoupling, proration. −3: no signature verification on webhook payload (was absent in source too), amounts trust product row only |
| Unit tests | 13/15 | 6 tests incl. idempotency + proration |
| Wired surface | 4/15 | Registered in PaymentsModule but module not in `app.module`; **no live route** (D12) |
| Integration/E2E | 4/20 | CI-gated |
| Deploy alignment | 3/15 | Monolith surface absent; legacy monolith payments module also unwired |

## Reading the scores

The uniform weak columns are **Integration/E2E (4/20)** and **deploy alignment**
— exactly the G2/G3 retirement gates. That is one shared workstream (CI e2e job
vs real Postgres + manifest rewiring), not three separate gaps; landing it lifts
all three domains ~20–25 points and unlocks the first physical retirements.
Domain-specific gaps worth noting: Payments has no live HTTP surface (D12), and
Users mutations lack guards.
