# SERVICE_SNAPSHOT — notifications-service

**Path:** `services/notifications-service`

## Purpose
TBD — شرح مأموریت سرویس بر اساس دامنه. (در REPORT.md تکمیل شود.)

## Interfaces
- HTTP: default port 3000 (قابل تنظیم با `PORT`)
- Health: `/healthz` (Terminus/NestJS در صورت فعال‌سازی)

## Dependencies
- Packages: @nestjs/common, @nestjs/core, @nestjs/platform-express, @nestjs/swagger, reflect-metadata, rxjs, @prisma/client, nodemailer, twilio, firebase-admin, amqplib, @arman/service-kit, @arman/integration, @nestjs/config, helmet, compression, pino, nestjs-pino
- External: PostgreSQL, Redis/RabbitMQ (در صورت نیاز)

## Scripts
```
{
  "build": "tsc -p tsconfig.build.json",
  "start": "node dist/main.js",
  "dev": "ts-node src/main.ts",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "prisma:generate": "prisma generate --schema prisma/schema.prisma",
  "prisma:migrate:dev": "prisma migrate dev --name init --schema prisma/schema.prisma",
  "prisma:migrate:deploy": "prisma migrate deploy --schema prisma/schema.prisma",
  "prisma:db:push": "prisma db push --schema prisma/schema.prisma",
  "test:e2e": "jest --runInBand --config jest.config.ts --testPathPattern=tests/e2e/",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "test:cov": "jest --coverage",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "format:check": "prettier -c . || echo \"no prettier\"",
  "clean": "rimraf dist || true",
  "format": "prettier --write .",
  "prepare": "husky install || true",
  "prisma:migrate": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
}
```

## Env
- See root `.env.example` و `ENVIRONMENT_REFERENCE.md`

## KPIs
- Latency p95, Error rate, Throughput (Prometheus)
