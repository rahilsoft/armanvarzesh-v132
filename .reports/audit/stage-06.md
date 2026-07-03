# Stage 06 — Backend Audit (NestJS)

**Source of truth:** repository only.

---

## Findings

### P1-01 — No global `ValidationPipe` in most microservices (mass-assignment / injection surface)
**Evidence:** Only `services/courses-service/src/main.ts` and `services/users-service/src/main.ts` (and a handful) reference `ValidationPipe`; of 30 `services/*/src/main.ts`, most (e.g. `services/payments-service/src/main.ts`) call `NestFactory.create` + middleware but never register a global `ValidationPipe` with `whitelist:true, forbidNonWhitelisted:true`. Bodies are consumed as raw typed literals (`@Body() body:{...}`) or `any`.
**Why it is a problem:** Without `whitelist`, extra properties pass through to Prisma `create`/`update` → mass assignment (CWE-915). Without validation, malformed input reaches business logic.
**Production impact:** Mass assignment on user-controlled writes; unvalidated input.
**Recommended fix:** Register `app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted:true, transform:true }))` in every bootstrap; use class-validator DTOs.
**Effort:** M. **Risk:** High.

### P1-02 — DI bypassed by inline `new PrismaClient()`
**Evidence:** 86 sites (Stage 03 P1-01), e.g. `payments.service.ts:13 prisma = new PrismaClient();`. This is a field initializer, not a constructor-injected provider.
**Why it is a problem:** Defeats NestJS lifecycle (`OnModuleDestroy` → `$disconnect`), so pools are never closed; defeats testability (cannot inject a mock); defeats shared transaction/UoW.
**Production impact:** Pool exhaustion, un-mockable code, no graceful shutdown.
**Recommended fix:** Single injectable `PrismaService`.
**Effort:** M. **Risk:** High.

### P2-03 — Global guards/filters/interceptors registered in only 2 apps
**Evidence:** `APP_GUARD`/`APP_FILTER`/`APP_INTERCEPTOR` appear only in `services/auth-service/src/app.module.ts`, `app/backend/src/app.module.ts`, `app/backend/app.module.ts`. The other 33 services have no global exception filter/guard registered via DI.
**Why it is a problem:** Inconsistent error formatting and no default-deny auth guard; each service invents its own (or none), so unauthenticated access defaults open where header-trust patterns exist (Stage 05 P0-01).
**Production impact:** Inconsistent error contracts; auth not enforced by default.
**Recommended fix:** Standard bootstrap (`@arman/nest-bootstrap` exists) applying global filter + guard everywhere.
**Effort:** M. **Risk:** Medium.

### P2-04 — Swagger/OpenAPI wired in only ~9 places for 34+ services
**Evidence:** `SwaggerModule`/`DocumentBuilder` in 9 files. `package.json ci:openapi:lint` only checks `app/backend/openapi.*` and otherwise prints "No OpenAPI schema found".
**Why it is a problem:** Most REST services have no machine-readable contract; API consumers and contract tests have nothing to validate against.
**Production impact:** Undocumented APIs; contract drift.
**Recommended fix:** Generate Swagger per service or a unified spec.
**Effort:** M. **Risk:** Low.

### P3-05 — Duplicate `app.module.ts` in `app/backend`
**Evidence:** Both `app/backend/app.module.ts` and `app/backend/src/app.module.ts` exist.
**Recommended fix:** Remove the stale root copy.
**Effort:** S. **Risk:** Low.

---

## Positives (verified)
- **115** health/readiness endpoint references — health checks broadly present (e.g. gateway `/health` + `/ready` with subgraph readiness, `main.ts:38-60`).
- **108** metrics/prom-client references — Prometheus instrumentation widespread.
- `@arman/observability-sdk/register` imported at process start in services (`payments-service/src/main.ts:2`).
- `services/auth-service` correctly wires global providers via DI.

## Stage score: **48/100** (Backend)
Health/metrics coverage is genuinely good; the gap is uniform validation and DI-managed Prisma.
