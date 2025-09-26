# Runbook – ArmanFit Backend

## Rollout (Kubernetes)
1. Ensure secrets:
   ```bash
   kubectl create secret generic armanfit-secrets      --from-literal=DATABASE_URL='postgresql://...'      --from-literal=JWT_SECRET='...' -o yaml --dry-run=client | kubectl apply -f -
   ```
2. Deploy/update:
   ```bash
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl rollout status deploy/armanfit-backend
   kubectl get pods -l app=armanfit-backend
   ```

## Rollback
```bash
kubectl rollout undo deploy/armanfit-backend
```

## DB Migrations
- Preview plan in CI.
- Backup before apply (managed PG backup snapshot).
- Apply in CD:
```bash
kubectl exec -it deploy/armanfit-backend -- sh -lc 'npm run prisma:migrate'
```

## Health & Probes
- Readiness/Liveness: `GET /health`

## Logs & Metrics
- Stream logs:
```bash
kubectl logs -l app=armanfit-backend -f
```
- Prometheus/Grafana available via existing stack.

## On-call – Incident
- Identify if failing probe → `kubectl describe pod ...`
- If DB unavailable → check RDS/PG status
- If migration failed → rollback + restore backup
- Always capture the root cause in postmortem doc (within 48h).
