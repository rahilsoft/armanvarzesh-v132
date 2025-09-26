# ArmanVarzesh — Pro Final Release
**Build time:** 2025-08-24 21:05 UTC

این بسته شامل تمام بهبودهای ساختاری، تست، CI/CD، امنیت و e2e است که در این سری انجام شد.

## هایلایت‌ها
- یکپارچه‌سازی Workspace و نام‌گذاری پکیج‌ها (`@arman/*`) و اصلاح ارجاعات `./apps/` → `./app/`.
- حذف شاخه‌های موازی کم‌استفاده، تنظیم EAS برای `coach-app`.
- e2e برای PWAها (Playwright) + گزارش HTML + آپلود آرتیفکت‌ها.
- Visual Regression برای PWAها با baseline‌های اولیه.
- Lighthouse CI روی خروجی build و همچنین روی URL پیش‌نمایش/Pages (با آستانه‌های متفاوت برای PR و main).
- Preview Deploy برای هر PR و Deploy به Pages روی main/master.
- ماتریس Node (18/20)، کش‌های Vite/Next/Playwright.
- Dependency Review، Semgrep SAST (diff-aware روی PR، full روی main)، CodeQL.
- پایگاه‌داده اپهمرال Postgres + Prisma generate/migrate + seeding دامنه.
- سرویس‌های Redis و MinIO در CI، Bootstrap bucket و آپلود نمونه assetها.
- BullMQ smoke (enqueue/dequeue) برای اطمینان از سلامت صف‌ها.
- OpenAPI Lint (Spectral) و Synthetic Smoke HTTP 200 روی مسیرهای کلیدی.
- Workflow مکمل Integration Services برای تست زیرساختی backend با سرویس‌ها.

## اجرای محلی
```bash
pnpm install

# Typecheck/Build/Test کلی
pnpm -r typecheck
pnpm -r build
pnpm -r test

# Playwright (اولین‌بار)
npx playwright install --with-deps

# e2e و Visual
pnpm --filter ./app/user-pwa test:e2e
pnpm --filter ./app/coach-pwa test:e2e
pnpm --filter ./app/user-pwa test:visual
pnpm --filter ./app/coach-pwa test:visual

# Prisma (تولید کلاینت + مایگریشن + سید دامنه)
pnpm db:generate:all
pnpm db:migrate:all
pnpm db:seed:all

# تست صف Redis
pnpm ci:queue:test
```

## CI/CD
- **ci-unified.yml**: همه‌چیزِ Front + QA + Security + Pages.
- **ci-integration-services.yml**: سرویس‌ها (Postgres/Redis/MinIO) + Prisma + seed + تست‌های backend.

## نکات ادغامی
- اگر ریپوی قدیمی اسکوپ یا مسیر متفاوت دارد، بعد از merge `pnpm i && pnpm -r build` را اجرا کنید.
- اگر Lighthouse روی main fail داد، برای شروع می‌توانید thresholds را کمی نرم‌تر کنید و سپس سخت‌گیرانه کنید.

موفق باشید. 💪
