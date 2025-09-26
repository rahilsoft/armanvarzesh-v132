# Release Engineering (10/10)

- **Changesets**: نسخه‌دهی خودکار با PR
  - ایجاد تغییر: `pnpm changeset`
  - نسخه‌دهی: CI با `changesets/action` PR می‌سازد (publish خاموش).
  - در آینده می‌توان `NPM_TOKEN` را اضافه و publish را فعال کرد.

- **Docker multi-arch (GHCR)**:
  - هر `Dockerfile` به‌صورت ماتریسی برای `linux/amd64, linux/arm64` build و push می‌شود.
  - تگ‌ها: `sha-<commit>` و روی `main`، تگ `latest` نیز.
  - SBOM (SPDX) با Syft تولید و به‌عنوان artifact ضمیمه می‌شود.

- **Secrets scanning**: Gitleaks + گزارش SARIF در Code Scanning.

- **Env Allowlist**: همهٔ `process.env.*` باید در `.env.allow` باشند. CI در صورت تخطی fail می‌شود.

- **Build Score 10/10**: اسکریپت `scripts/build-score-10.mjs` وضعیت هر پکیج را ارزیابی می‌کند؛ CI اگر امتیاز هر پکیج کمتر از ۸ باشد، قرمز می‌شود.

- **پیشنهاد بعدی**: فعال‌سازی انتشار npm برای کتابخانه‌های عمومی، و امضای کانتینرها با Cosign + SLSA provenance (در صورت تنظیم Secrets).