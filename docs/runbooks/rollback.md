# Runbook — Safe Rollback

## Preconditions
- Release artifacts tagged (SemVer), migrations reversible.

## Steps
1. Freeze traffic (canary to 0% or pause deploy).
2. Rollback app container to previous tag.
3. Apply DB rollback migration if needed.
4. Verify health: readiness/liveness, key smoke tests.
5. Unfreeze traffic gradually (10% → 50% → 100%).

## Validation
- Error rate back to baseline, no DLQ surge, dashboards green.
