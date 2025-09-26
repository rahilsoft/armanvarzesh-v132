# Live Runbook (Ops)

## 1) Health & Metrics
- Health: `GET /health` (200 + `{ ok: true }`)
- Metrics: `GET /metrics` (Bearer `METRICS_TOKEN`)

## 2) Admin Access
- Login: POST `/admin/login` → token (JWT), role
- Roles: owner / coach / support
- Troubleshoot:
  - 401 → JWT منقضی یا تنظیم نبودن `ADMIN_JWT_SECRET`
  - 403 → دسترسی نقش کافی نیست

## 3) Payments
- وبهوک Stripe باید raw-body داشته باشد.
- بررسی وضعیت پرداخت‌ها: جدول `Payment`، فیلد `status='succeeded'`

## 4) Live (WS)
- در صورت چند replica: `REDIS_URL` را ست کنید (Socket.IO Redis adapter)
- Ingress با sticky-cookie فعال است.
- اگر پیام‌ها sync نشدند: اتصال Redis/فایروال بررسی شود.

## 5) Analytics
- آمار رویداد: `GET /live/analytics/event/:id`
- Aggregate روزانه: `GET /live/analytics/event/:id/aggregate`
- Retention: حذف لاگ‌های قدیمی‌تر از `LIVE_ANALYTICS_RETENTION_DAYS`

## 6) Deploy
- CI: Build & Push → Staging/Prod Deploy (Helm)
- در صورت شکست: `kubectl describe deploy` و لاگ‌ها
