
# RUNBOOK — Execution & Operations

## Local
```bash
corepack enable
pnpm install --no-frozen-lockfile
pnpm -r run typecheck
pnpm -r run build
pnpm -r run start
```

## Docker
Per service with Dockerfile:
```bash
docker build -t arman/<service>:dev .
docker run --env-file .env -p 3000:3000 arman/<service>:dev
```

## Kubernetes
- Use SealedSecrets for credentials
- Deploy OTEL, Prometheus, Grafana
- Apply Helm charts (not bundled here)

## Incident & SLO
- Monitor p95 latency, error_rate, rps
- Postmortem template: `docs/incident/postmortem-template.md`
