# Launch Runbook & Checklist

## T-7 days
- Freeze feature؛ فقط باگ‌فیکس
- مرور امنیت: Gitleaks/CodeQL/Trivy بدون High
- تمرین رول‌بک: بازیابی از آخرین بکاپ DB

## T-24 hours
- برچسب release و قطع دسترسی نوشتن روی main
- تایید secrets و ENV ها برای stage/prod
- Warm-up CDN و کش تصاویر

## T-1 hour
- مهاجرت DB (prisma migrate deploy)
- افزایش replicas
- بررسی داشبوردها (APM, Logs, Health)

## T (Go Live)
- اعمال کانفیگ DNS/Ingress
- smoke test: Auth, Workout, Payment
- مانیتورینگ خطاها/تاخیر

## T+24 hours
- مرور متریک‌ها (LCP, error rate, p95 latency)
- Postmortem کوتاه و فهرست باگ‌ها/بهبودها

## Rollback Playbook
- Revert به تصویر/commit قبلی
- `prisma migrate reset` روی محیط تست، هرگز prod
- بازگردانی از بکاپ زمان‌دار
