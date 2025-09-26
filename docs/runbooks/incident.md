# Runbook — Incident Response

## Scope
Production incidents: elevated error rate, degraded performance, security alerts.

## Steps
1. Acknowledge in Pager/On-call channel. Assign IC (Incident Commander).
2. Triage with metrics: error rate, p95 latency, queue lag, DB connections.
3. Mitigate quickly: rollback latest release or scale up replicas.
4. Communications: post status every 15 minutes.
5. Root-Cause Analysis (RCA) within 48h. File ADR if policy changes.

## Dashboards (examples)
- API: `/metrics` (Prometheus), tracing (OTel).
- Queues: BullMQ dashboard (failed, retry, DLQ).

## Escalation Matrix
- Security Lead, DevOps Lead, Backend Lead.
