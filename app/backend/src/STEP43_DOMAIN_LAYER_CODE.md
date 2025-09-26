# Phase 6 — Step 43: Final Domain/Business Logic Layer

## Added (apps/backend/src/lib/domain)
- **errors.ts**: `DomainError`, `ValidationError`, `AuthFailedError`, `ForbiddenError`.
- **types.ts**: انواع توکن/خروجی Auth و Payment (Create/List).
- **validators.ts**: بررسی `amountCents` مثبت و مجموعهٔ ارزهای مجاز.
- **auth.usecase.ts**: `AuthUseCase` با:
  - ورود با نام کاربری/گذرواژه (مقایسهٔ امن bcryptjs/یا fallback به bcrypt)
  - صدور `access`/`refresh` با **JwtService** و TTLهای خوانده‌شده از env.
  - متد `refresh(refreshToken)`
- **payments.usecase.ts**: `PaymentsUseCase` با:
  - ایجاد پرداخت **idempotent** + اعتبارسنجی ورودی
  - لیست پرداخت‌های کاربر با **keyset pagination**
- **domain.module.ts**: ماژول Nest که `SafePrismaService`، Repositoryها و UseCaseها را **provide/export** می‌کند.
- **index.ts**: Barrel export.

## نکات ادغام
- در هر Controller سرویس‌های دامنه را از `DomainModule` تزریق کنید:
  ```ts
  @Controller('auth')
  export class AuthController {
    constructor(private readonly auth: AuthUseCase) {}
    @Post('login') login(@Body() dto: { username: string; password: string }) { return this.auth.login(dto.username, dto.password); }
  }
  ```
- برای TTLهای JWT از `JWT_TTL` و `REFRESH_JWT_TTL` استفاده می‌شود (فرمت: `900s`, `12h`, `30d`).

