# SERVICE_SNAPSHOT — armanfit-admin

**Path:** `app/armanfit-admin`

## Purpose
TBD — شرح مأموریت سرویس بر اساس دامنه. (در REPORT.md تکمیل شود.)

## Interfaces
- HTTP: default port 3000 (قابل تنظیم با `PORT`)
- Health: `/healthz` (Terminus/NestJS در صورت فعال‌سازی)

## Dependencies
- Packages: react, react-dom, react-router-dom, @apollo/client, graphql, antd, dayjs, @arman/ui-tokens, react-hook-form, zod, @arman/ui-components, @nestjs/graphql, @nestjs/apollo, @apollo/server
- External: PostgreSQL, Redis/RabbitMQ (در صورت نیاز)

## Scripts
```
{
  "start": "node dist/main.js",
  "build": "tsc -p tsconfig.build.json",
  "dev": "ts-node src/main.ts",
  "test": "jest --passWithNoTests || vitest run || echo \"no tests\"",
  "storybook": "storybook dev -p 6007",
  "build-storybook": "storybook build",
  "preview": "vite preview",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx || echo \"no eslint\"",
  "test:cov": "jest --coverage",
  "typecheck": "tsc -p tsconfig.build.json --noEmit",
  "format:check": "prettier -c . || echo \"no prettier\"",
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
