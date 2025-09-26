# ADR-0001: Governance Baseline & Quality Gates

## Status
Accepted

## Context
We need uniform governance across the monorepo: code style, lint, typecheck, tests, security scans, and CI gates.

## Decision
- Adopt .editorconfig, Prettier, and base ESLint across all packages.
- Introduce CI required checks: lint, typecheck, unit/integration/e2e, coverage gate, sbom, sca, codeql, secret-scan, container build/scan, lighthouse.
- Enforce branch protection with required checks.

## Consequences
- Consistent quality and safer merges.
- Faster reviews and fewer regressions.
