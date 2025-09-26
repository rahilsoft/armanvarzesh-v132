# گزارش نهایی و راهنمای Build — آرمان ورزش
تاریخ: 2025-08-22 08:52:20

این سند جمع‌بندی بهبودها و **راهنمای دقیق Build** محلی و روی **Codemagic** را ارائه می‌دهد.

---

## ۱) جمع‌بندی تغییرات کلیدی (فازهای ۱ تا ۴۴)
- **تثبیت وابستگی‌ها**: TypeScript **5.6.x**، `@nestjs/passport@11.0.5`، Node **>=20**، PNPM **9.6** (Corepack).
- **امنیت**: `SanitizePipe`، ValidationPipe سفت‌وسخت، Gitleaks در CI، سیاست مجوزها (Android/iOS)، ATS سخت‌گیر.
- **عملکرد**: Keyset pagination، بهینه‌سازی تصاویر (sharp/svgo)، `SmartImage` (RN/Web)، کش HTTP (`Cache-Control`).
- **پایداری بیلد**: Next.js `output: 'standalone'` + خاموش کردن sourcemap پروڈاکشن، tsconfig.build برای Nest، Gradle سخت‌تر.
- **مستندسازی**: README حرفه‌ای، TSDoc/JSDoc، CHANGELOG، گزارش‌های مرحله‌ای.
- **لایه‌ها**: Data (SafePrismaService + Repositories)، Domain (UseCaseها)، Presentation (کنترلرهای REST + DTO ها).

---

## ۲) پیش‌نیازها
- **Node.js 20** (با nvm: `nvm use`، فایل `.nvmrc` موجود است)
- **PNPM 9.6** از طریق Corepack  
  ```bash
  corepack enable
  corepack use pnpm@9.6.0
  ```
- PostgreSQL 14+ و Redis 6+ (برای اجرای کامل بک‌اند)

---

## ۳) تنظیم متغیرهای محیطی
فایل‌های نمونه را طبق نیاز کپی و مقداردهی کنید:
```
cp .env.example .env
# یا در هر سرویس: apps/backend/.env و ...
```
متغیرهای مهم Backend:
- `DATABASE_URL`, `REDIS_URL`
- `JWT_SECRET`, `JWT_TTL` (مثل `900s`)، `REFRESH_JWT_SECRET`, `REFRESH_JWT_TTL` (مثل `30d`)
- `ADMIN_USERS_JSON`: آرایه‌ای از { u, h, r } (هش bcrypt در `h`)

> **هشدار**: هیچ کلید حساسی را در مخزن نگه ندارید؛ از Secret Store پلتفرم‌ها (GitHub/Codemagic) استفاده کنید.

---

## ۴) راه‌اندازی محلی (Local)
### نصب و آماده‌سازی
```bash
corepack enable && corepack use pnpm@9.6.0
pnpm -w i
pnpm -C apps/backend prisma migrate deploy   # یا: pnpm -C apps/backend prisma migrate dev
```

### اجرای سرویس‌ها
```bash
# Backend (NestJS)
pnpm -C apps/backend start:dev

# Vitrin (Next.js)
pnpm -C apps/vitrin-site dev

# User App (Expo)
pnpm -C apps/user-app start
```

### بیلد محلی
```bash
pnpm -w build
# یا اسکریپت آماده:
./scripts/build.local.sh
```

### تست‌ها
```bash
pnpm -C apps/backend test
pnpm -C apps/backend test:coverage
pnpm -C apps/user-app test
```

---

## ۵) Codemagic — پیکربندی پیشنهادی (Monorepo + PNPM)
فایل `codemagic.yaml` در ریشه قرار داده شده است. در Codemagic یک **App** جدید بسازید و این مخزن را متصل کنید.

### متغیرهای لازم در Codemagic (Environment variables)
- برای **وب/بک‌اند** (Linux Runner):
  - `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `REFRESH_JWT_SECRET`
- برای **Android Release**:
  - `CM_KEYSTORE` (Base64 keystore)، `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, `CM_KEY_PASSWORD`
- برای **iOS Release** (اختیاری در این پروژه):
  - گواهی‌ها/پروفایل‌ها طبق راهنمای Codemagic.

### گردش‌کارها (خلاصه)
- `web_build`: نصب وابستگی‌ها با pnpm، بیلد Next.js (standalone)، آرشیو `.next/standalone` و `.next/static` به‌عنوان artifact.
- `backend_test`: نصب وابستگی‌ها، اجرای تست‌های NestJS/Prisma.
- `android_release`: بیلد RN اندروید (assembleRelease) با کش Gradle و store pnpm.
- `ios_release` (در صورت نیاز): روی ماشین مک Mini (M1) با Node 20 و pnpm؛ امضای کد از Secrets.

> کش‌ها: `~/.pnpm-store`, `.next/cache`, `~/.gradle/caches` فعال شده‌اند.

---

## ۶) نکات پایانی و Known Issues
- اگر قصد مهاجرت به **GraphQL 17 + @apollo/server v4** دارید، این کار را در شاخهٔ جدا انجام دهید.
- برای لینک‌های HTTP محلی، در **Debug** اجازهٔ Cleartext/ATS بدهید؛ Release باید سخت‌گیر بماند.
- در صورت استفاده از HealthKit/Garmin/Google Fit، entitlementها و مجوزهای لازم را **هدفمند** اضافه کنید.
- حتماً `pnpm-lock.yaml` ریشه commit شده باشد؛ CI «lockfile-aware» است.

---

## ۷) چک‌لیست انتشار
1) `pnpm -w i && pnpm -w check:repo`  
2) اجرای تست‌ها و build محلی (`pnpm -w build`)  
3) تنظیم Secrets در Codemagic و اجرای workflow مناسب  
4) بررسی artifacts (Next standalone, Android .apk/.aab)  
5) Tag و Release طبق نسخه‌گذاری در `CHANGELOG.md`

موفق باشید. 🙌
