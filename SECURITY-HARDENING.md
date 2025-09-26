
# Security Hardening — Phase 1 (Global Middleware)

- این فاز، میان‌افزارهای پایه را برای تمام NestJS/Expressها اعمال می‌کند:
  - `helmet()` + `contentSecurityPolicy` پیش‌فرض قابل‌سفت‌ترشدن
  - `cors` با `CORS_ORIGIN` محیطی
  - `hpp` (HTTP Parameter Pollution)
  - `express-rate-limit` (پنجره زمانی و سقف از Env قابل تنظیم)
- برای Nest (Express adapter) و Express قابل استفاده است. اگر سرویس Fastify داشتید، این سیم‌کشی به‌طور خودکار نادیده گرفته می‌شود.

## Env
- `CORS_ORIGIN` — لیست ریشه‌های مجاز (پیش‌فرض `*` برای توسعه)
- `RATE_LIMIT_WINDOW_MS` — پیش‌فرض 60000
- `RATE_LIMIT_MAX` — پیش‌فرض 120
- برای CSP در تولید، بهتر است nonces/hashهای اسکریپت را اضافه کنید.



## Phase 2 — JWT Rotation (kid) + JWKS + Rate-Limit کاربر/توکن + CSP Nonce
- Envها:
  - `JWKS_URL` — آدرس JWKS (فعال‌سازی خودکار JWT verify در صورت تنظیم)
  - `JWT_ISSUER`, `JWT_AUDIENCE` — قیود اختیاری
  - `JWT_ALGS` — مثل `RS256`
  - `JWT_KID_REQUIRED=1` — اجباری‌کردن presence کلید `kid` در هدر
  - `RATE_LIMIT_PREFIX` — پیشوند سطل‌ها
  - `CSP_NONCE_MODE=1` — فعال‌سازی CSP با nonce (نیازمند استفادهٔ nonce در قالب‌های Frontend)
- سرویس‌ها به‌صورت خودکار:
  - `app.use(buildJwtVerifier())` → اگر `JWKS_URL` نباشد، no-op
  - `app.use(buildUserAwareRateLimit())` → bucket بر اساس `sub` از JWT، توکن یا IP
  - `app.use(cspMiddleware({mode:'nonce'}))` → فقط اگر `CSP_NONCE_MODE=1`، در غیر این صورت baseline CSP فعال است.
