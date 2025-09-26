# Phase 6 — Step 42: Final Data Layer Code

## Backend Data Layer (NestJS)
ایجاد شد در `apps/backend/src/lib/data`:

- `prisma.safe.ts` → **SafePrismaService**: اتصال/قطع امن، single client، helperهای `Prisma.sql/join`.
- `repositories/user.repository.ts` → عملیات کاربر: `findById`, `findByUsername`, `ensureAdmin`.
- `repositories/payment.repository.ts` → عملیات پرداخت: `create`, `findById`, `findByIdempotencyKey`, `listByUser` با **keyset pagination**.
- `common/pagination/keyset.ts` (در صورت نبود) → `encodeCursor`, `decodeCursor`, `whereKeyset`.

## نکات
- Repositoryها به‌صورت **Injectable** برای تزریق در سرویس‌های دامنه آماده‌اند.
- در مرحله‌های بعدی اگر سرویس‌ها به‌روز شوند، تنها محل تغییر منطق داده، همین لایه خواهد بود.
- از `Prisma.sql` برای جلوگیری از ترکیب رشته‌ای و حملات تزریق در WHERE/ORDER استفاده کنید.

