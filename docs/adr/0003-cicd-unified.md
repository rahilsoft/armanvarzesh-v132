# ADR-0003: CI/CD — Unified Pipeline & Required Checks

## Status
Accepted

## Decision
- Use GitHub Actions with required checks: lint, typecheck, tests (unit/integration/e2e), coverage, SBOM, SCA, SAST (CodeQL), secret scan, container scan, Lighthouse.
- Concurrency and pnpm cache enabled.

## Consequences
- Predictable mergers; fast feedback; security posture improved.
