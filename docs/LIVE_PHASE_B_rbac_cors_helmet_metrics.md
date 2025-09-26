# Live Phase B — Admin RBAC (JWT), CORS/Helmet Hardening, Metrics Lockdown

## RBAC (JWT)
- Endpoint: `POST /admin/login` → ورودی `{ username, password }` از `ADMIN_USERS_JSON`
- خروجی: `{ token, role }` — توکن JWT با `ADMIN_JWT_SECRET`, TTL=`ADMIN_JWT_TTL` (پیش‌فرض 12h)
- Roles: `owner`, `coach`, `support`
- Guards:
  - `AdminJwtGuard` → اعتبارسنجی توکن
  - `RolesGuard` + `@Roles(...)` → کنترل دسترسی سطح نقش
  - برای سازگاری قبلی، `AdminGuard` هنوز Bearer `ADMIN_API_TOKEN` را می‌پذیرد.

## CORS/Helmet
- `helmet({ contentSecurityPolicy: false })` فعال شد.
- `ALLOWED_ORIGINS` → لیست مبداهای مجاز (کاما جدا).
- CORS فقط برای Origin‌های مجاز اجازه می‌دهد.

## Metrics Lockdown
- `GET /metrics` اکنون با **MetricsGuard** محافظت می‌شود.
  - یا `Authorization: Bearer ${METRICS_TOKEN}`
  - یا IP در `METRICS_ALLOW_FROM` (prefix match ساده)

## Frontend Admin
- صفحهٔ `/admin/login` → ورود با username/password، دریافت JWT و ذخیره در کوکی `admin_token`.
- همهٔ درخواست‌های Admin هدر Authorization را از کوکی می‌سازند.

## ENV نمونه
```
ADMIN_JWT_SECRET=supersecret
ADMIN_JWT_TTL=12h
ADMIN_USERS_JSON=[{"u":"admin","p":"changeme","r":"owner"}]

ALLOWED_ORIGINS=http://localhost:3000

METRICS_TOKEN=metrics-secret
METRICS_ALLOW_FROM=10.0.0.,127.0.0.1,::1
```
> در تولید رمزها را امن و رمزنگاری‌شده مدیریت کنید (Vault/Secrets Manager) و از گذرواژه‌های ساده اجتناب کنید.
