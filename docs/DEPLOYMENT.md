# Deployment Runbook (ArmanVarzesh)

> This document describes how to build, configure and deploy the monorepo to staging/production.

## 1) Requirements
- Node.js 20.x, PNPM 9
- Docker (24+) and a registry (GHCR/ECR)
- Kubernetes (>=1.26) with Ingress, Cert-Manager (optional)
- PostgreSQL (if used), Redis (for queues/rate limit), Object Storage (S3-compatible)

## 2) Build Matrix
- Backend: `pnpm --filter ./app/backend build`
- Web (Vitrin): `pnpm --filter ./app/vitrin-site build`
- Mobile (Expo): build via EAS/Codemagic
- Services: `pnpm --filter ./services/* build`

## 3) Migrations
- Prisma: `pnpm --filter ./app/backend prisma migrate deploy`

## 4) ENV Management
- Each package contains `.env.example` listing required keys.
- Use a secret manager (GH Encrypted Secrets/K8s Sealed Secrets). Rotate tokens periodically.

## 5) Health/Observability
- Expose `/healthz` and `/readyz` (backend/services). Ship logs to Loki. Traces via OTEL.

## 6) Rollout/Rollback
- Use progressive delivery (rolling update). Keep at least one previous image tagged for rollback.

## 7) Smoke Tests
- After deploy, run basic read/write flows for Auth, Payments, Workouts, Reservations.

## Lockfile
> Generate a **real** `pnpm-lock.yaml` by running:
```
pnpm install
pnpm dedupe
pnpm install --lockfile-only
```
Then commit the lockfile and ensure CI uses `--frozen-lockfile`.


## Backend (tests)
```bash
cd app/backend
pnpm install
pnpm test -- --coverage
```


## Docker Compose (local stack)
```bash
cp .env.example .env
docker compose up -d --build
# backend: http://localhost:3000
# vitrin:  http://localhost:3001
```
