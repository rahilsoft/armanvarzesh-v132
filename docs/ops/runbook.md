
# ArmanVarzesh v90 — Ops Runbook (Final)

## TL;DR
- **SLO**: API p50 < 150ms, ingest lag < 60s, error rate < 1%.
- **Dashboards**: Grafana → "ArmanVarzesh — Health & Commerce", "AV — Traces Overview".
- **Alerts**: WearablesIngestionLagHigh, ApiLatencyHigh. Pager: Ops-OnCall.

## Incident Response
1) **Triage** (5m): Check alerts, look at p50/p95 panels. If 5xx spikes → open Traces (Tempo) filtered by gateway route.
2) **Identify** (10m): Drill spans with highest duration. Correlate logs (Loki) via `trace_id` derived field.
3) **Mitigate** (15m): 
   - Scale gateway/backends: `kubectl scale deploy gateway --replicas=2`.
   - Circuit-breaker already wraps upstream `fetch`. If an upstream is flapping, temporarily reduce traffic via Ingress rules or feature flag.
4) **Validate**: Error/latency curves returning to baseline. Close incident with timeline.

## Deployments / Rollbacks
- **Preview** per PR: GH Actions `preview-bake.yml` → namespace `av-prev-<run_id>`.
- **Prod**: `helm upgrade --install av90 deploy/helm -f deploy/helm/values.yaml`
- **Rollback**: `helm rollback av90 <REV>` + DB rollback via Prisma migration history.

## DB Migrations
- Always run on staging with seed data first.
- Rollback: `prisma migrate resolve --applied <migration>` then re-apply previous snapshot; ensure backups are current.

## Secrets & Rotation
- Sealed-Secrets: follow `deploy/k8s/sealed-secrets/README.md`. Rotate JWT (kid) quarterly; overlap validation 24h.

## Authentication
- Prefer JWKS via `JWKS_URL`. Optional `REQUIRE_DEVICE_ID=true` برای device-bound.

## Mesh & Network
- Enable sidecar: `bash deploy/mesh/namespace-label.sh <ns>`.
- Enforce STRICT mTLS: apply PeerAuthentication + AuthorizationPolicy.
- NetworkPolicies در Helm فعال است؛ اگر نیاز به اجازهٔ خروجی خاصی دارید، پورت/دامنه را اضافه کنید.

## Performance
- Gate: `scripts/latency-check.js` (p50) و `scripts/k6-habits.js` (p50/p95).
- بودجه‌ها در `docs/perf/budgets-and-slos.md`.

## Mobile
- Detox در `mobile-detox.yml` (placeholder تا وصل‌شدن build واقعی). Battery bench: `scripts/android-battery-bench.sh`, `scripts/ios-battery-bench.sh`.

## SBOM & Security
- CI: `.github/workflows/sbom.yml` تولید CycloneDX؛ dependency review فعال.  
- CSP: `STRICT_CSP=true` در Gateway برای حذف inline.

## Frequently Used Commands
```bash
# Health
kubectl get pods -n <ns>
kubectl logs deploy/gateway -n <ns> | jq -r .
# Traces
kubectl port-forward svc/otel-collector 4318:4318 -n <ns>
# Helm
helm history av90 -n <ns> && helm rollback av90 <REV> -n <ns>
```
