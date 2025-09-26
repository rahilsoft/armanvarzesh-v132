# Phase 6 — Step 44: Presentation/UI Layer (Backend REST)

## افزوده شد
- **DTO ها** (`apps/backend/src/presentation/dto`):
  - `auth.dto.ts` → `LoginDto`, `RefreshDto`
  - `payments.dto.ts` → `CreatePaymentDto`, `ListPaymentsQuery`
- **کنترلرها** (`apps/backend/src/presentation/controllers`):
  - `AuthController` → `POST /auth/login`, `POST /auth/refresh`
  - `PaymentsController` → `POST /payments`, `GET /payments` (Header: `x-user-id`; Idempotency: `Idempotency-Key`)
- **PresentationModule**: `apps/backend/src/presentation/presentation.module.ts` (واردکنندهٔ `DomainModule`)
- در صورت موجود بودن `AppModule`، ماژول نمایشی به آرایهٔ `imports` اضافه شد.

## امنیت و کارایی
- روی تمام هندلرها: `SanitizePipe` + `ValidationPipe(whitelist, transform)`
- برای `GET /payments`: `CacheControlInterceptor` با `@cacheControl('private, max-age=15, stale-while-revalidate=30')`

## هم‌ترازی با Frontend
- صفحات Next.js و اسکرین‌های RN قبلی از مسیرهای REST `GET/POST /payments` استفاده می‌کنند و با این کنترلرها سازگار هستند.
- برای احراز هویت، کلاینت می‌تواند از `POST /auth/login` و `POST /auth/refresh` استفاده کند و توکن‌ها را ذخیره کند.
