# K8s Secrets (Templates)

این دایرکتوری شامل Secret Template برای هر سرویس است. **مقادیر داخل این فایل‌ها فقط نمونه هستند** و باید بعد از
تغییر در محیط امن، با دستور زیر اعمال شوند:

```bash
kubectl apply -f k8s/secrets/<service>.secret.yaml
```

توصیه‌ها:
- از Secret Manager یا External Secrets استفاده کنید و از commit مقادیر واقعی خودداری کنید.
- برای هر سرویس **DATABASE_URL** مجزا تعریف کنید (Schema-per-service یا Database-per-service).
- برنامهٔ چرخش دوره‌ای کرِدها (Rotation) را اجرا کنید.

ایجاد: 2025-08-18T16:01:11.468365
