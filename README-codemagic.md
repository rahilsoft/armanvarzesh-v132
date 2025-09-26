# ArmanVarzesh – Codemagic build patch (Backend + Prisma + pnpm)

این بسته شامل حداقل فایل‌های لازم برای رفع خطاهای اصلی بیلد روی Codemagic است:
- تغییر **Prisma** به PostgreSQL برای پشتیبانی از `Json` در `Workout.data`
- اضافه شدن تمام back-relation ها روی `User` برای رفع خطای `P1012`
- تنظیمات **Nest + SWC** برای بیلد سریع و Type-check فعال
- تنظیمات **TypeScript** برای حذف خطاهای `TS2564` با `strictPropertyInitialization:false`
- اسکریپت‌های `package.json` + افزوده شدن `prisma` و `@prisma/client` به دیپندنسی‌ها

## نصب
1) محتویات این آرشیو را دقیقاً در همان مسیرهای پروژه جایگزین کنید.
2) در Codemagic مقدار **DATABASE_URL** را به صورت Secret ست کنید. مثال:
```
postgresql://USERNAME:PASSWORD@HOST:5432/arman?schema=public
```
3) ورک‌فلو `web-and-backend` را اجرا کنید.

## نکات
- اگر ماژول‌های داخلی مثل `@arman/infra` یا `@arman/graphql-utils` فقط سورس را اکسپورت می‌کنند، `paths` در `tsconfig.json` به پوشه `packages/*/src` اشاره می‌کند تا Type-check کامل شود.
- برای تولید کلاینت Prisma در CI، مرحله `Prisma generate` قبل از بیلد اجرا می‌شود و نیازی به اتصال پایگاه داده ندارد (فقط از schema تولید می‌شود).
- اگر هنوز ایمپورت‌های پراکنده‌ای مثل نام‌کلاس اشتباه (`KavehnegarSmsService` به‌جای `KavenegarSmsService`) وجود داشته باشد، آن‌ها را تصحیح کنید تا بیلد تمیز بماند.

موفق باشید ✌️
