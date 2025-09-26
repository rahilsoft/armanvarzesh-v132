# SERVICE_SNAPSHOT — armanfit-user

**Path:** `app/user-app`

## Purpose
TBD — شرح مأموریت سرویس بر اساس دامنه. (در REPORT.md تکمیل شود.)

## Interfaces
- HTTP: default port 3000 (قابل تنظیم با `PORT`)
- Health: `/healthz` (Terminus/NestJS در صورت فعال‌سازی)

## Dependencies
- Packages: expo, react, react-native, @react-navigation/native, @react-navigation/native-stack, @apollo/client, graphql, expo-font, @nestjs/graphql, @nestjs/apollo, graphql-ws, expo-image-picker, expo-file-system, expo-barcode-scanner, expo-av
- External: PostgreSQL, Redis/RabbitMQ (در صورت نیاز)

## Scripts
```
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "build": "tsc -p tsconfig.json",
  "dev": "nodemon --watch src --exec ts-node src/main.ts",
  "lint": "pnpm -w exec eslint . --ext .ts,.tsx",
  "test": "jest --passWithNoTests",
  "test:cov": "jest --coverage",
  "typecheck": "tsc -p tsconfig.json --noEmit || echo 'no tsconfig'",
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
