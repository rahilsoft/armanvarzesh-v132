# SERVICE_SNAPSHOT — @arman/backend

**Path:** `app/backend`

## Purpose
TBD — شرح مأموریت سرویس بر اساس دامنه. (در REPORT.md تکمیل شود.)

## Interfaces
- HTTP: default port 3000 (قابل تنظیم با `PORT`)
- Health: `/healthz` (Terminus/NestJS در صورت فعال‌سازی)

## Dependencies
- Packages: @prisma/client, @nestjs/common, @nestjs/core, @nestjs/platform-express, @nestjs/config, @nestjs/throttler, @nestjs/graphql, @nestjs/apollo, graphql, nestjs-pino, pino, pino-http, prom-client, @apollo/server, bullmq, ioredis, helmet, @opentelemetry/api, express-rate-limit, jsonwebtoken ...
- External: PostgreSQL, Redis/RabbitMQ (در صورت نیاز)

## Scripts
```
{
  "start": "node dist/main.js",
  "start:dev": "nest start --watch",
  "build": "tsc -p tsconfig.build.json",
  "typecheck:full": "tsc -p tsconfig.json --noEmit",
  "prisma:generate": "prisma generate --schema src/database/prisma/schema.prisma",
  "prisma:migrate:dev": "prisma migrate dev --schema src/database/prisma/schema.prisma",
  "prisma:migrate:deploy": "prisma migrate deploy --schema ./src/database/prisma/schema.prisma",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "format:check": "prettier -c . || echo \"no prettier\"",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "test:cov": "jest --coverage",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "test:e2e": "jest -c e2e/jest.e2e.config.ts",
  "e2e": "vitest run -r ./e2e",
  "prisma:studio": "prisma studio --schema src/database/prisma/schema.prisma",
  "seed": "ts-node src/scripts/seed.ts || echo \"seed skipped\"",
  "dev": "ts-node src/main.ts",
  "clean": "rimraf dist || true",
  "format": "prettier --write .",
  "prepare": "husky install || true",
  "prisma:migrate": "prisma migrate deploy"
}
```

## Env
- See root `.env.example` و `ENVIRONMENT_REFERENCE.md`

## KPIs
- Latency p95, Error rate, Throughput (Prometheus)
