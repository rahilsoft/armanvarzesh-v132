# Phase 2 — Remediation Plan (Initial)

## 1) Apollo Server Migration (app/backend)
- Replace `apollo-server-express` v3 with `@apollo/server` v4 and `@apollo/server/express4`:
  ```bash
  pnpm remove apollo-server-express
  pnpm add @apollo/server @apollo/server-plugin-usage-reporting graphql
  pnpm add express graphql-ws @graphql-tools/schema
  ```
- In `app/backend/src/main.ts` integrate `expressMiddleware(server, {{ context }})` and migrate plugins.
- Guard `playground`/`introspection` by env, disable in production.

## 2) DTO Validation + Global Pipes
- Ensure `class-validator` and `class-transformer` are installed.
- In `main.ts`:
  ```ts
  app.useGlobalPipes(new ValidationPipe({{ whitelist: true, forbidNonWhitelisted: true, transform: true }}));
  ```

## 3) Resilience Policy (HTTP & DB)
- Introduce an Axios wrapper with timeout/retry/circuit and replace direct `axios.*` usages.
- Wrap Prisma calls in try/catch + error mapper; log with request-id.

## 4) Replace `console.log`
- Replace with Nest Logger or Pino adapter, ensure log levels by env.

## 5) Raw SQL Unsafe
- Replace `$queryRawUnsafe`/`$executeRawUnsafe` with parameterized alternatives.

## 6) Testing Baseline
- Add Jest + @nestjs/testing config; write smoke tests for critical modules.
