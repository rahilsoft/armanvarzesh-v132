# Arman Codemagic Fix v2

این بسته سه فایل می‌دهد که مشکل «Invalid command: nest build» و 404 برای `@nestjs/swc` را در Codemagic حل می‌کند.

## فایل‌ها
- `codemagic.yaml` — یک ورک‌فلو آماده که:
  - pnpm را ستاپ می‌کند
  - اگر `@nestjs/swc` در `apps/backend/package.json` باشد، حذفش می‌کند
  - نصب workspace
  - `prisma generate` با Postgres (اگر Secret نبود، مقدار پیش‌فرض بی‌خطر می‌گذارد)
  - بیلد backend با دستور صحیح: `pnpm dlx @nestjs/cli build -b swc --type-check`

- `ci/build_backend.sh` — اسکریپت بیلد محلی/CI برای بک‌اند با همان دستور صحیح.

- `ci/fix_pkg_json.sh` — اسکریپت اختیاری برای پاک کردن `@nestjs/swc` از `apps/backend/package.json` در صورت وجود.

## استفاده سریع
1) `codemagic.yaml` را در ریشه پروژه جایگزین کن (یا دست‌کم مرحله بیلد را از آن کپی کن).
2) اگر خواستی لوکال تست کنی:  
   ```bash
   bash ci/fix_pkg_json.sh
   bash ci/build_backend.sh
   ```

> نکته: اگر هنوز خطاهای TypeScript می‌بینی، آن خطاها ربطی به CLI ندارند و باید DTOها/سرویس‌ها با تایپ‌های Prisma هم‌راستا شوند.