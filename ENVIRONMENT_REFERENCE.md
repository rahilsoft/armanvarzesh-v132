
# ENVIRONMENT_REFERENCE.md

این سند مرجع متغیرهای محیطی پروژه «آرمان ورزش» است. مقادیر زیر نمونه‌های امن هستند و باید با Secret Manager جایگزین شوند.

- **Node/Runtime**
  - `NODE_ENV`: one of `development|test|production`
  - `PORT`: پورت پیش‌فرض هر سرویس (پیشنهاد: منحصر به سرویس)

- **Database**
  - `DATABASE_URL`: PostgreSQL 15 (utf8)، schema=public

- **Cache/Broker**
  - `REDIS_URL`: برای کش/قفل/نرخ‌دهی
  - `RABBITMQ_URL`: صف اصلی، DLQ

- **Auth/Security**
  - `JWT_ISSUER`, `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`
  - `JWT_PUBLIC_KEY`, `JWT_PRIVATE_KEY` (PEM) — Rotation با kid

- **Observability**
  - `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, `LOG_LEVEL`

- **Comms**
  - `SMTP_URL`, `SMS_PROVIDER_API_KEY`

**Policy:** هیچ Secret در مخزن؛ استفاده از Sealed Secrets / Secret Manager. 
