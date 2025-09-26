# DevEx Quickstart

## Prerequisites
- Node.js 20+, Docker & Docker Compose, Git

## Monorepo layout
- `apps/` — frontends & admin panels
- `services/` — microservices
- `k8s/` & `helm/` — deployment manifests
- `.github/workflows/` — CI/CD

## Setup
```bash
cp .env.example .env
npm i -g turbo
npm install
```

## Development (Docker + profiles)
```bash
docker compose --profile infra up -d   # start Postgres/Redis/RabbitMQ/MinIO
docker compose --profile dev up --build
```

## CI
- `CI` workflow: lint/typecheck/test with Turbo
- `Security Scan (Trivy)`: scheduled + on push to main
- `Docker Publish (GHCR)`: pushes service images to GitHub Container Registry

> برای انتشار ایمیج‌ها، `packages: write` باید فعال باشد و روی repo visibility دقت کنید.
---

## DevOps (Prod)

### Publish Images
- Set repo visibility and permissions.
- On `main`, workflow **Docker Publish (GHCR)** ایمیج هر سرویس را با تگ‌های `latest` و `sha` منتشر می‌کند.
- Registry prefix: `ghcr.io/<org>/<repo>/<service>`.

### Kubernetes
- Manifests: `k8s/` (Namespace + Config/Secrets + Deployment/Service per service).
- Helm chart: `helm/armanfit` — لیست سرویس‌ها را در `values.yaml` پر کن، سپس:
```bash
helm upgrade --install armanfit helm/armanfit -n armanfit --create-namespace
```

### Security
- `Security Scan (Trivy)` برای فایل‌سیستم و `Trivy Image Scan` برای ایمیج‌های منتشر شده.

### Compose (Prod)
```bash
export IMAGE_PREFIX=ghcr.io/<org>/<repo>
docker compose --profile prod up -d
```
## Observability Stack
- **Prometheus** (metrics) → http://localhost:9090
- **Grafana** (dashboards) → http://localhost:3001 (default admin creds per image)
- **Loki** (logs), **Tempo** (traces)
- **OTel Collector** endpoint: `http://localhost:4318` (in-cluster: `http://otel-collector:4318`)

### Start Infra + Observability
```bash
docker compose --profile infra up -d prometheus grafana loki tempo otel-collector
```

### Tracing from services
- سرویس‌ها `@arman/observability` را import می‌کنند و با `OTEL_EXPORTER_OTLP_ENDPOINT` (پیش‌فرض: `http://otel-collector:4318`) ارسال می‌شود.
- اسم سرویس از `OTEL_SERVICE_NAME` یا `SERVICE_NAME` خوانده می‌شود.
## Auth (Real JWT/Refresh)
- Service: `auth-service` با **argon2**، **JWT access/refresh**، جدول‌های **User/Session/RefreshToken**.
- Prisma schema در `services/auth-service/prisma/schema.prisma`
- Seed ادمین: `admin@armanfit.local / Admin@12345` (dev only)

### Useful ENV
```
JWT_SECRET=change_me
JWT_EXPIRES_IN=15m
REFRESH_TTL_MS=604800000
```

## Auth Enterprise Features
- Refresh rotation & multi-device sessions (Device/Session/RefreshToken models)
- 2FA (TOTP): `/auth/totp/enable` → returns otpauth URL, `/verify`, `/disable`
- Password reset flow: `/auth/password/request` & `/auth/password/confirm`
- Swagger: `/docs` روی همه سرویس‌ها

## Domain Services (New)
### workouts-service
- CRUD: `/workouts` (create/list/get/update/delete)
- Schema: Exercise/Workout/WorkoutItem

### payments-service
- `/payments/products` (POST create, GET list)
- `/payments/orders` (POST create order)
- `/payments/intent/:orderId` (POST create Stripe PI)
> از STRIPE_SECRET در dev استفاده می‌شود (test key).

### notifications-service
- `/notifications/email` (POST queue email via dev SMTP)
- `/notifications/:id` (GET status)
