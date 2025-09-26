
# Registry / Offline Install Playbook

## ساده‌ترین حالت (اینترنت دارید)
- هیچ کاری لازم نیست. Workflow از `install_with_fallback.sh` استفاده می‌کند.

## اگر پشت فایروال/پراکسی هستید
- در Codemagic → Environment variables:
  - `REGISTRY_URL=https://registry.npmjs.org/` (یا آدرس mirror داخلی)
  - در صورت نیاز: `HTTP_PROXY` و `HTTPS_PROXY`

## بیلد بدون اینترنت
1. روی یک سیستم با اینترنت:
   ```bash
   bash scripts/ci/prepare_offline_bundle.sh
   ```
   دو خروجی می‌سازد: `offline_store.tgz` و `offline_packages/`.
2. در CI، قبل از نصب:
   - `offline_store.tgz` را extract کنید به مسیر store pnpm (یا در ریشه).
   - سپس:
     ```bash
     bash scripts/ci/install_with_fallback.sh
     ```

## کش در Codemagic
- مسیرهای `.pnpm-store` و `node_modules` کش می‌شوند تا دفعه‌های بعد سریع باشند و به اینترنت کمتری نیاز باشد.
