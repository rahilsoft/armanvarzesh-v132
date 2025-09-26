# LAUNCH — One-Page Playbook

## 0) Preconditions
- Branch `main` ✅ all required CI gates (see `CI_PHASE6.md`).
- Secrets in Secret Manager (none in VCS): DB URLs, JWT keys, Store creds.
- Registry & K8s access configured in repo secrets.

## 1) Prepare Staging
```bash
# DB migrations & seeds (staging)
chmod +x tools/db/migrate-all.sh
./tools/db/migrate-all.sh
./tools/db/seed-all.sh   # بعد از تکمیل اسکیمای seed هر سرویس
```

## 2) Tag & Release (Backend/Site)
```bash
git tag vX.Y.Z && git push origin vX.Y.Z
# GH Actions: build & push images, package Helm, deploy prod, run post-deploy smoke
```

## 3) Deploy/Upgrade (Helm)
```bash
# Example (prod):
helm upgrade --install backend ./deploy/helm/armanvarzesh   -n prod --create-namespace   -f deploy/helm/armanvarzesh/values-prod.yaml   --set image.tag=vX.Y.Z   --atomic --wait --timeout 10m
```

## 4) Post-Deploy Verification
```bash
# uses tests/api-smoke/smoke-endpoints.json
./tools/verify/post_deploy_verify.sh https://api.example.com
```

## 5) Canary (Optional)
- `templates/canary.yaml`: deploy `backend-canary`.
- Route 1–10% traffic via ingress; watch SLOs.

## 6) Mobile Release
- iOS/Android via `mobile-release.yml` (manual dispatch).
- Provide signing creds via repo secrets.

## 7) Rollback
```bash
# Helm
helm rollback backend <REV> -n prod
# DB: restore from backup if needed (ensure backward-compatible migrations)
```

## Observability
- Traces: OpenTelemetry OTLP → Collector
- Metrics: `/metrics` (Prometheus); ServiceMonitor active
- Logs: JSON structured; ship to your log stack

## Ownership
- CODEOWNERS enforced; PR template includes security & test checklist.
- Incident runbook: `docs/INCIDENT_RUNBOOK.md`
