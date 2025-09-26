# Phase 3 — Execution Pack (Validation & Headers & CI)
Date: 2025-08-18

Applied changes:
- **Global ValidationPipe + GlobalExceptionFilter** wired in `app/backend/src/main.ts` and filter implemented at `src/common/filters/global-exception.filter.ts`.
- **Next.js security headers** added to `app/vitrin-site/next.config.js` (CSP + basic hardening).
- **Security CI** workflows added under `.github/workflows/` (`security-gitleaks.yml`, `security-trivy.yml`, `security-semgrep.yml`).

Notes:
- You may need to tune CSP (`Content-Security-Policy`) to your real asset domains/CDNs.
- If class-validator/transformer packages are not installed, add them before build.
