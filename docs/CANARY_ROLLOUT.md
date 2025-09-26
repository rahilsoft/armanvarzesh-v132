# استراتژی Canary/Rolling

## گزینه ساده (Deployment RollingUpdate)
- `maxSurge: 25%`
- `maxUnavailable: 0`

## نمونه دستور
```bash
helm upgrade --install backend ./deploy/helm/backend -f deploy/helm/values-canary.yaml
kubectl rollout status deploy/backend
```

## بازگشت (Rollback)
```bash
kubectl rollout undo deploy/backend
```
