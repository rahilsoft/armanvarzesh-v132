# Fix Plan (مرحله‌بندی)

## Phase 1 — Hygiene
- حذف مسیرهای هاردکد و URLهای `http://`
- یکسان‌سازی Node 20 و pnpm 9 در همه پکیج‌ها
- بازنویسی `install.sh` بر پایه workspace

## Phase 2 — Security
- CORS محدود، JWT secrets از ENV، غیر فعال کردن introspection/playground در prod
- افزودن Throttler و محافظت از آپلودها

## Phase 3 — DB & Performance
- افزودن ایندکس‌های مکمل بر جداول پرتراکنش
- DataLoader برای GraphQL، صفحه‌بندی استاندارد

## Phase 4 — CI/CD
- الگوی واحد GitHub Actions با cache pnpm
- تولید artifacts (schema.gql, coverage, build)
- Trivy, CodeQL, Gitleaks

## Phase 5 — Containers & K8s
- Dockerfile چندمرحله‌ای، کاربر غیرریشه، healthcheck
- compose با وابستگی‌ها و healthcheck
- K8s: resources، probes، Ingress TLS، HPA

## Phase 6 — QA & Launch
- اجرای تست‌های Unit/E2E
- Lighthouse CI
- Runbook لانچ و رول‌بک

### معیار پذیرش
- CI سبز در شاخه main
- ابزار امنیتی بدون High بازگشتی
- متریک‌های Performance در بودجه تعیین‌شده
