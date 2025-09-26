
# On-call Runbook — ArmanVarzesh v90

## Priority Alert Index
1. **API p50 latency > 150ms (10m)** — check gateway CPU/memory, upstream 5xx, circuit breaker state.
2. **Wearables ingestion lag > 30s (5m)** — check queues/connectors; scale ingestion workers.
3. **DB connection saturation** — verify max_connections and pool; restart noisy pods.
4. **Error spikes on /v1/payments or /v1/subscriptions** — payment provider status; circuit breaker.
5. **PodCrashLoopBackOff** — `kubectl logs -p`, check secrets, recent deploys.

## Triage Flow
- Fetch recent deploys & image tags (PR preview or main): `kubectl -n <ns> get deploy -o wide`.
- Check logs with trace links (Loki): filter `trace_id` then jump to Tempo.
- Inspect Gateway audit logs (search `type=audit`), identify client IPs, rate-limit hits.

## Common Procedures
### Rollback
1. `helm rollback <release> <REVISION>`
2. Verify health: `/readyz` & `/healthz`, SLO panels.

### Scale
- Temporary scale up: `kubectl scale deploy api-gateway --replicas=3`

### Secrets Rotation
- Prepare new secret as Kubernetes Secret; seal with `kubeseal` and commit.
- Apply sealed secret; rollout restart deployments.

### DB Backup/Restore
- Nightly logical backups with `pg_dump` to object storage.
- Restore: spin up shadow DB, verify migrations, cutover via connection string swap.

## Contacts
- Payments: ops-payments@internal
- Mobile CI: mobile-ci@internal
- SRE: sre@internal
