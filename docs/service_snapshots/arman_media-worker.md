# SERVICE_SNAPSHOT — @arman/media-worker

**Path:** `services/media-worker`

## Purpose
TBD — شرح مأموریت سرویس بر اساس دامنه. (در REPORT.md تکمیل شود.)

## Interfaces
- HTTP: default port 3000 (قابل تنظیم با `PORT`)
- Health: `/healthz` (Terminus/NestJS در صورت فعال‌سازی)

## Dependencies
- Packages: bullmq, sharp, execa, @aws-sdk/client-s3, @arman/service-kit, @arman/integration
- External: PostgreSQL, Redis/RabbitMQ (در صورت نیاز)

## Scripts
```
{
  "build": "tsc -p tsconfig.build.json",
  "start": "node dist/main.js",
  "start:dev": "tsx src/main.ts",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "test:cov": "vitest run --coverage",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "format:check": "prettier -c . || echo \"no prettier\"",
  "dev": "ts-node src/main.ts",
  "clean": "rimraf dist || true",
  "format": "prettier --write .",
  "test:e2e": "echo \"e2e placeholder\"",
  "prepare": "husky install || true",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
}
```

## Env
- See root `.env.example` و `ENVIRONMENT_REFERENCE.md`

## KPIs
- Latency p95, Error rate, Throughput (Prometheus)
