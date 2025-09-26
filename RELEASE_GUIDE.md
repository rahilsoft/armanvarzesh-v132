# راهنمای انتشار (Release Guide)

## پیش‌نیاز
- GHCR فعال و دسترسی `packages: write` برای GITHUB_TOKEN
- Secrets محیط Production/Staging در GitHub:
  - `K8S_CONFIG` (درصورت دیپلوی مستقیم از CI)
  - مقادیر پایگاه‌داده/ردیس/مین‌یو/ربیت‌ام‌کیو (به عنوان Secret یا در Secret Manager کلاستر)

## فرآیند
1. افزایش نسخه در `package.json` (root یا سرویس‌ها) و Commit.
2. ایجاد تگ نسخه:
   ```bash
   git tag vX.Y.Z && git push origin vX.Y.Z
   ```
3. Workflow `Release` به‌صورت خودکار:
   - برای سرویس‌های اصلی ایمیج می‌سازد
   - **Trivy** FS & Image را اجرا و نتیجۀ SARIF را آپلود می‌کند
   - **SBOM CycloneDX** تولید می‌کند
   - سه تگ ایمیج منتشر می‌کند: `vX.Y.Z`, `sha-<commit>`, `latest`
   - چارت‌های Helm را lint و package کرده و به صورت Artifact ذخیره می‌کند
   - فایل نمونه `values-canary.yaml` تولید می‌کند (کاناری ۲۰٪ با NGINX Ingress)

## دیپلوی Staging
- ایمیج‌های مورد نظر را در `values.yaml` سرویس‌ها ست کنید (tag = نسخه جدید).
- برای تست کاناری (NGINX Ingress):
  - از `helm/armanfit/values-canary.yaml` نمونه استفاده کنید.
  - درخواست‌هایی با Header `X-Canary: yes` به نسخه کاناری هدایت خواهند شد یا با وزن ۲۰٪ تقسیم می‌شوند.

## Rollback
- کافی است tag قبلی ایمیج را در `values.yaml` برگردانید و `helm upgrade` بزنید.
- پایگاه‌داده: از بکاپ قبل از `migrate deploy` استفاده کنید.

## ریسک/کنترل
- اگر Trivy Critical/High داشت، قبل از Prod برطرف شود.
- SBOM را برای تطابق لایسنس‌ها نگه دارید.