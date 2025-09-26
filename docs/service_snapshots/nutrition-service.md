# SERVICE_SNAPSHOT — nutrition-service

**Path:** `services/nutrition-service`

## Purpose
TBD — شرح مأموریت سرویس بر اساس دامنه. (در REPORT.md تکمیل شود.)

## Interfaces
- HTTP: default port 3000 (قابل تنظیم با `PORT`)
- Health: `/healthz` (Terminus/NestJS در صورت فعال‌سازی)

## Dependencies
- Packages: @nestjs/common, @nestjs/core, @nestjs/graphql, @nestjs/platform-express, @prisma/client, class-transformer, class-validator, graphql, reflect-metadata, rxjs, @nestjs/terminus, joi, @nestjs/throttler, @opentelemetry/api, @opentelemetry/sdk-node, @opentelemetry/exporter-trace-otlp-http, @opentelemetry/auto-instrumentations-node, dataloader, @nestjs/apollo, @arman/service-kit ...
- External: PostgreSQL, Redis/RabbitMQ (در صورت نیاز)

## Scripts
```
{
  "start": "node dist/main.js",
  "build": "tsc -p tsconfig.build.json",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "format": "prettier --write .",
  "test:cov": "jest --coverage --runInBand",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "dev": "ts-node src/main.ts",
  "prisma:generate": "prisma generate --schema prisma/schema.prisma",
  "prisma:migrate:dev": "prisma migrate dev --name init --schema prisma/schema.prisma",
  "prisma:migrate:deploy": "prisma migrate deploy --schema prisma/schema.prisma",
  "prisma:db:push": "prisma db push --schema prisma/schema.prisma",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "format:check": "prettier -c . || echo \"no prettier\"",
  "clean": "rimraf dist || true",
  "prepare": "husky install || true",
  "prisma:migrate": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
}
```

## Env
- See root `.env.example` و `ENVIRONMENT_REFERENCE.md`

## KPIs
- Latency p95, Error rate, Throughput (Prometheus)
