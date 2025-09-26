# Release Checklist (Live)

- [ ] ENV ها کامل: `ADMIN_JWT_SECRET`, `ALLOWED_ORIGINS`, `METRICS_TOKEN`, `DATABASE_URL`, `REDIS_URL`, Stripe keys
- [ ] Prisma مایگریت‌ها اجرا شد (`prisma migrate deploy`)
- [ ] /admin/login → JWT دریافت می‌شود (نقش صحیح)
- [ ] /metrics فقط از شبکه داخلی یا با توکن قابل دسترسی است
- [ ] WS با دو replica و Redis sync است
- [ ] Dashboard Grafana ایمپورت شد و متریک‌ها جریان دارند
- [ ] Alertها فعال و آدرس‌های اطلاع‌رسانی تنظیم شده
- [ ] CORS/Helmet/CSP بر اساس دامنه‌های واقعی تنظیم شد
- [ ] CDN/Cache-Control برای assets فعال است
- [ ] Smoke-tests بعد از deploy پاس می‌شوند
