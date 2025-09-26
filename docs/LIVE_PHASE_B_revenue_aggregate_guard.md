# Live Phase B — Daily Revenue Aggregates + Admin Guard

## Worker (Prisma)
- `AnalyticsWorker.rollupHourly()` اکنون درآمد روزانه را از جدول `Payment` با `status='succeeded'` و بازهٔ `createdAt ∈ [day, day+1)` محاسبه می‌کند.
- فیلدها در `LiveEventDailyAggregate` به‌روزرسانی می‌شوند: `revenueGross`, `revenueNet`.

## Admin Guard (DEV)
- `app/vitrin-site/middleware.ts`: محافظت از مسیرهای `/admin/**` با کوکی `admin_token`.
- مقدار مورد انتظار از `NEXT_PUBLIC_ADMIN_TOKEN` خوانده می‌شود.
- یک‌بار می‌توانید با `?token=<value>` به `/admin` بروید تا کوکی ست شود.
> این فقط یک محافظ توسعه است؛ در تولید باید SSO/JWT/NextAuth پیاده شود.

## ENV
```
PAYMENT_FEE_PCT=3
NEXT_PUBLIC_ADMIN_TOKEN=changeme
```
