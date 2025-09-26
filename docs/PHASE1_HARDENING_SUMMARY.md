# Phase 1 Hardening Summary
Date: 2025-08-18
Scope: Architecture-level remediations derived from Phase 1 findings.

## Changes Applied
1. K8s per-service secret templates added under `k8s/secrets/`. Removed legacy `k8s/11-secrets.yaml`.
2. Pinned image tags in Helm/charts to `v2025.08.18`; added scripts to enforce and bump tags.
3. Added PodDisruptionBudget and default NetworkPolicy templates to Helm charts.
4. Added `.env.example` across services/apps and updated root `.gitignore`.
5. Added this summary and an RTL Persian HTML report (docs/fa/گزارش-فاز-۱.html).

## Notes
- No potentially breaking runtime upgrades were done (e.g., Apollo v3 -> v4) to avoid breaking builds.
- Database split is prepared via per-service secrets; physical split will be executed with migrations in Phase 2.
