# Chaos Exercises (Playbook)
- **Pod Kill (backend/media-worker):** randomly delete a pod; expect HPA/ReplicaSet to recover.
- **Network Latency:** use `tc` or a service mesh to inject 200ms latency; SLO alert should fire if p95 > 300ms.
- **Redis Down:** stop Redis for 1 minute; jobs should retry and idempotency prevent duplicates.
- **DB Failover:** briefly deny connections; readiness should flip to false, liveness remain true.
