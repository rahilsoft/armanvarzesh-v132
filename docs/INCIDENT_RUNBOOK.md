# INCIDENT RUNBOOK (v1)

1) Detection
- Alert from Prometheus/Grafana or user reports.
- Triage dashboard: p95 latency, 5xx, error logs, DB health.

2) First Response
- Assign Incident Commander (IC) و Scribe.
- Create incident room (Slack/Teams). Severity S1..S3.

3) Stabilize
- Rollback last deploy اگر مرتبط بود (helm rollback).
- Feature flag/Canary reduce یا disable.

4) Diagnosis
- Correlate traces (OTel), logs (structured), metrics.
- Check recent changes (git, release notes).

5) Resolution
- Hotfix یا config change. Verify post-deploy smoke.

6) Postmortem (within 72h)
- Timeline, root cause, corrective actions (no blame).
- Track actions with owners & deadlines.
