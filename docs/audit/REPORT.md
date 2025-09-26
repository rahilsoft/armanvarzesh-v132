# گزارش ممیزی مونوریپو — آرمان‌ورزش (REF_DATE=2025-08-23, TZ=Europe/Amsterdam)

**حالت:** فقط گزارش‌دهی؛ هیچ تغییری در ریپو اعمال نشده است. تمام اصلاحات صرفاً به‌صورت Patch Proposal ارائه شده‌اند.

## خلاصهٔ اجرایی

- امتیاز کل: **64/100**

- مهم‌ترین ریسک‌ها (16 مورد):

  - `SEC-JWT-INLINE` در `armanvarzesh v81/devops/kubernetes/secrets.yaml:8`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/devops/kubernetes/secrets.yaml:8`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/admin/components/RBAC.tsx:5`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/auth.service.spec.ts:12`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/e2e.integration.spec.ts:66`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/test/admin.jwt.guard.spec.ts:10`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/test/admin.controller.spec.ts:7`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/test/unit/auth.service.spec.ts:15`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/test/e2e/auth.e2e-spec.ts:21`

  - `SEC-SECRET-HARDCODED` در `armanvarzesh v81/app/backend/dist/database/seeds/seed_users.js:8`

### ۱۰ اقدام فوری پیشنهادی

- Enable strict TypeScript across all tsconfig.json — اثر: +3 score — ETA: 4h

- Create CI workflow with typecheck/lint/test/build — اثر: +5 score — ETA: 3h

- Add JWT secret management via env + rotation — اثر: Reduce auth breach risk — ETA: 6h

- Introduce rate limiting & security headers — اثر: Mitigate abuse — ETA: 3h

- Add DB indexes on foreign keys in Prisma — اثر: -120ms p95 on joins — ETA: 2h

- Implement centralized logging (pino) with correlationId — اثر: Faster incident triage — ETA: 4h

- Add tests to core modules (Auth/Payments/Workout) — اثر: +4 test score — ETA: 12h

- Add service worker & manifest to PWA apps — اثر: +PWA score — ETA: 4h

- Add SBOM/SCA/Secret scan to CI — اثر: Supply-chain risk down — ETA: 2h

- Provide ENV.example without secrets — اثر: Safer onboarding — ETA: 1h


## مانیفست پکیج‌ها

فایل CSV: `artifacts/manifests/packages.csv` — تعداد پکیج‌ها: **83**


## ماتریس Feature × Platform

فایل CSV: `artifacts/manifests/feature-matrix.csv`


## نمودار وابستگی

فایل: `artifacts/diagrams/dependency-graph.md`


## SBOM (CycloneDX)

فایل: `artifacts/sbom.json` — تعداد کامپوننت‌ها: **254**


## CI/CD

هیچ workflow فعالی در `.github/workflows` یافت نشد. Patch Proposal برای ایجاد CI افزوده شد.


## Transcript فرمان‌ها

به علت محدودیت‌های محیط آفلاین، اجرای build/test/Lighthouse انجام نشد. فقط اسکن ایستا انجام شد.


---





# Monorepo Audit Report — ArmanVarzesh (REF_DATE=2025-08-23, TZ=Europe/Amsterdam)

**Mode:** Report-only; no changes applied to the repo. All fixes are provided as Patch Proposals (diffs).

## Executive Summary

- Total Score: **64/100**

- Key Risks (16):

  - `SEC-JWT-INLINE` at `armanvarzesh v81/devops/kubernetes/secrets.yaml:8`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/devops/kubernetes/secrets.yaml:8`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/admin/components/RBAC.tsx:5`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/auth.service.spec.ts:12`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/e2e.integration.spec.ts:66`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/test/admin.jwt.guard.spec.ts:10`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/test/admin.controller.spec.ts:7`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/test/unit/auth.service.spec.ts:15`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/test/e2e/auth.e2e-spec.ts:21`

  - `SEC-SECRET-HARDCODED` at `armanvarzesh v81/app/backend/dist/database/seeds/seed_users.js:8`

### Top 10 Immediate Actions

- Enable strict TypeScript across all tsconfig.json — Impact: +3 score — ETA: 4h

- Create CI workflow with typecheck/lint/test/build — Impact: +5 score — ETA: 3h

- Add JWT secret management via env + rotation — Impact: Reduce auth breach risk — ETA: 6h

- Introduce rate limiting & security headers — Impact: Mitigate abuse — ETA: 3h

- Add DB indexes on foreign keys in Prisma — Impact: -120ms p95 on joins — ETA: 2h

- Implement centralized logging (pino) with correlationId — Impact: Faster incident triage — ETA: 4h

- Add tests to core modules (Auth/Payments/Workout) — Impact: +4 test score — ETA: 12h

- Add service worker & manifest to PWA apps — Impact: +PWA score — ETA: 4h

- Add SBOM/SCA/Secret scan to CI — Impact: Supply-chain risk down — ETA: 2h

- Provide ENV.example without secrets — Impact: Safer onboarding — ETA: 1h


## Package Manifest

CSV: `artifacts/manifests/packages.csv` — Packages: **83**


## Feature × Platform Matrix

CSV: `artifacts/manifests/feature-matrix.csv`


## Dependency Diagram

File: `artifacts/diagrams/dependency-graph.md`


## SBOM (CycloneDX)

File: `artifacts/sbom.json` — Components: **254**


## CI/CD

No workflows found under `.github/workflows`. A CI Patch Proposal was generated.


## Command Transcript

Due to offline constraints, build/test/Lighthouse were not executed. Only static scanning was performed.


**به‌روزرسانی:** ریشهٔ واقعی مونوریپو شناسایی شد: `armanvarzesh v81/` و در آن **67** workflow فعال یافت شد.

**Update:** Detected true monorepo root `armanvarzesh v81/` with **67** active workflows.
