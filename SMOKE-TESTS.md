# Security & Metrics Smoke Tests

- اجرای یک پکیج به‌صورت ایزوله و بررسی:
  - هدرهای امنیتی Helmet روی روت/health
  - فعال بودن Rate-Limit (429)
  - در دسترس بودن `/metrics` (Prometheus)

## اجرا محلی
```bash
pnpm install
node scripts/smoke-security.mjs <package-dir>
# مثال:
node scripts/smoke-security.mjs services/api-gateway
```
متغیرهای محیطی قابل تنظیم: `PORT` (پیش‌فرض 3000)، `METRICS_PORT` (9464)، `RATE_LIMIT_MAX` (5)، `RATE_LIMIT_WINDOW_MS` (10000)، `SMOKE_TIMEOUT_MS` (90000)