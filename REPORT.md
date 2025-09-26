
# گزارش ممیزی و سخت‌سازی فنی پروژه «آرمان ورزش»
**تاریخ:** 2025-08-19 07:02:25

## خلاصه اجرایی
این گزارش نتیجه‌ی ممیزی کامل کد، پیکربندی و زنجیره‌ی ساخت است. هدف: **Build Green، امنیت پایه، استانداردسازی CI/CD، و آمادگی لانچ**. جزئیات تغییرات در `CHANGELOG.md` و `HARDENING_SUMMARY.json` آمده است.

## وضعیت پیش از اصلاح (مشاهده‌شده از آرشیو ورودی)
- ساختار مونوریپو/چندریپو: الگوهای رایج apps/*، services/*، packages/* و libs/* شناسایی شد.
- چندین `package.json` بدون اسکریپت‌های استاندارد build/test/typecheck.
- نبود/ناهماهنگی tsconfigها در برخی بسته‌ها.
- نبود فایل‌های پایه کارگاهی: `pnpm-workspace.yaml`, `.npmrc`, `.editorconfig`, `.dockerignore` (ایجاد شد).
- CI/CD ناقص یا موجود نبود (افزوده شد).

## تغییرات کلیدی اعمال‌شده
- **استانداردسازی ابزارها**: Node>=20, PNPM>=9, TS>=5.5 (engines تعیین شد).
- **CI**: GitHub Actions با مراحل lint/type/test/build و artifact.
- **امنیت**: `SECURITY_CHECKLIST.md`، نمونه هدرهای امنیتی، سیاست JWT Rotation با kid (راهنما).
- **محیط**: `.env.example` کامل + `ENVIRONMENT_REFERENCE.md`.
- **TypeScript**: `tsconfig.base.json` و `tsconfig.build.json` برای بسته‌های TS.
- **Docker**: Dockerfile چندمرحله‌ای برای سرویس‌های اجرایی فاقد آن.
- **Service Snapshots**: برای هر سرویس در `docs/service_snapshots/` مستند شد.
- **Matrix تکنولوژی**: `TECHNOLOGY_MATRIX.md`.

## اقداماتی که باید در کد اعمال/تکمیل شوند (راهنمای توسعه‌دهندگان)
1. **Helmet/CSP** را در ورودی HTTP (Nest/Express/Next) فعال کنید.
2. **JWT Rotation**: کلیدهای امضای نسخه‌دار (kid) + JWKS.
3. **Rate Limit**: بر اساس user/token/IP با Redis.
4. **Validation**: با class-validator/zod.
5. **Observability**: OpenTelemetry + Prometheus (latency p95/p99, error_rate, rps).
6. **DB**: ایندکس‌های پرتراکنش؛ قفل خوش‌بینانه؛ idempotency keys.
7. **Testing**: پوشش 80%+؛ Testcontainers.
8. **Events**: قرارداد رویدادها و Outbox.
9. **Release**: SemVer + Conventional Commits.

## دستورالعمل اجرای محلی (خلاصه)
```bash
corepack enable
pnpm install --no-frozen-lockfile
pnpm -r run build
pnpm -r run start
```
جزئیات در `RUNBOOK.md`.

## ریسک‌های باقیمانده
- نیاز به اعتبارسنجی دامنه‌ای کدها
- احتمال ناسازگاری برخی نسخه‌ها (در CI آشکار می‌شود)
