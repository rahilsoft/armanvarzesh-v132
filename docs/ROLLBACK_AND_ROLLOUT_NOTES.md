# Rollout & Rollback Notes (Prod)

## Rollout (Blue/Green recommended)
1) Build & push images with immutable tags (commit SHA) and attach SBOM.
2) Apply DB migrations with `prisma migrate deploy` (Shadow DB recommended); take full backup before.
3) Helm upgrade with:
   - readiness/liveness probes enabled
   - resource requests/limits defined
   - maxUnavailable=0, maxSurge=1 (rolling update)
4) Post-deploy smoke (Playwright `e2e/smoke.spec.ts`) against ingress URL.

## Rollback
- `helm rollback <release> <rev>` if health fails.
- Restore database from pre-deploy backup if schema-breaking.

## SLO/SLI & Alerts
- Error rate, latency p95/p99, CPU/memory saturation.
- Health endpoints: `/health`, `/ready`.
