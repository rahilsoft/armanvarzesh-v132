# Changelog
All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), 
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.57.0-R2] - 2025-08-22
### Added
- **Security scanning** with Gitleaks and custom rules. See: `STEP29_SECRET_SCAN_REPORT.md`.
- **SanitizePipe** for request payload hardening (NoSQL/prototype pollution) and injection guards. See: `STEP30_SECURITY_INJECTION_REPORT.md`.
- **Asset optimization** pipeline (sharp + svgo) and Next.js bundle analyzer. See: `STEP31_APP_SIZE_REPORT.md`.
- **UI performance** helpers (`useStableCallback`, memoized primitives, FlatList optimizations, CSR list page). See: `STEP32_UI_PERF_REPORT.md`.
- **Memory management** utilities (AbortController support, cleanup hooks) + backend shutdown hooks. See: `STEP33_MEMORY_REPORT.md`.
- **SmartImage** components (RN `expo-image`, Web `next/image`) and cache headers. See: `STEP34_ASSET_LOADING_REPORT.md`.
- **Permissions policy** and native overlays (Android/iOS). See: `STEP35_PERMISSIONS_POLICY.md`.
- **TSDoc/JSDoc** annotations across complex modules. See: `STEP36_DOCSTRINGS_REPORT.md`.
- **Professional README** with setup/CI/CD/troubleshooting. See: `README.md`.
- **Final dependency stabilization** (`typescript@^5.6.2`, `@nestjs/passport@11.0.5`, Node 20, pnpm 9.6). See: `STEP38_DEPENDENCY_FINAL_CHECK.md`.
- **Build hardening** (Next.js standalone, disable prod sourcemaps; backend tsconfig.build; Android gradle.properties). See: `STEP39_BUILD_FINAL_REPORT.md`.

### Changed
- Unified **ValidationPipe** usage with safety options and stacked **SanitizePipe** on sensitive controllers.
- RN/Next pages and services updated to accept **AbortSignal** and cancel in-flight requests.
- Shared packages marked `sideEffects: false` to improve tree-shaking in web bundles.

### Fixed
- CI installation consistency by pinning **pnpm** via Corepack and ensuring a lockfile-aware workspace install.
- Potential injection vectors (currency/idempotencyKey validation, query DTOs, and service guards).

### Removed
- Risky/unused Android permissions in **Release** via manifest overlay; strict ATS on iOS by default.

### Performance
- Image resizing/compression, SVG optimization, and RN **inlineRequires**; removed console calls in production builds.
- Next.js: SWC minify + `images.formats=[AVIF, WebP]`; memoized list rendering on web and mobile.

### Security
- Secrets scanning and stricter `.gitignore`; environment-driven secrets with **.env.example** (see README).
- ESLint rules hardened: `no-eval`, `no-implied-eval`, `@typescript-eslint/no-implied-eval`, `react-hooks/exhaustive-deps`.

### Documentation
- Extensive inline TSDoc/JSDoc and a comprehensive **README** for developers and DevOps.

## [Earlier Phases 1–28]
- پایه‌سازی معماری (Clean Architecture)، هم‌ترازی اولیهٔ workspace، رفع ناسازگاری‌های CI، و آماده‌سازی مهاجرت‌ها (Nest 11, GraphQL 17, Apollo v4).
- اصلاح `.gitignore`، نمونهٔ `.env.example`، و یکپارچه‌سازی اسکریپت‌های پایهٔ build/test/lint.

---

## Upgrade Notes
- Node.js **>= 20** و **pnpm@9.6.0** لازم است (Corepack).
- TypeScript **5.6.x** و `@nestjs/passport@11.0.5` تثبیت شده‌اند. در صورت نیاز به نسخه‌های متفاوت، از شاخهٔ جداگانه استفاده کنید.
- برای استقرار Next.js از خروجی **standalone** استفاده کنید؛ sourcemapهای Production غیرفعال‌اند.

### v69-patched @ 2025-08-22T12:27:40.886764Z
- Admin panel skeleton
- PWA features scaffolds (coach/client)
- New services scaffolds where missing
- Mobile wrappers (Capacitor)
- E2E skeleton for certificate

### v69-patched-r2 @ 2025-08-22T12:37:50.857650Z
- Merged PWA features into existing apps: coach-app, user-app
- Removed duplicates: coach-pwa, user-pwa, coach-mobile, client-mobile, admin-panel
- Added admin modules scaffold inside apps/armanfit-admin/src/modules/* (placeholders only)


### v69-patched-r2 @ 2025-08-22T12:38:54.192010Z
- Removed duplicate scaffolds (apps/coach-mobile, apps/client-mobile, apps/admin-panel)
- Added feature screens inside existing apps: apps/user-app & apps/coach-app (React Native skeletons)
- Extended existing admin: apps/armanfit-admin/src/admin-modules/* with module placeholders + RBAC/Audit hooks


### v69-patched-r4 @ 2025-08-22T12:51:00.425715Z
- Added apps/coach-pwa and apps/user-pwa with feature scaffolds

## 20250830-1809 Phase 1
- Added hydration Prisma model and REST endpoints in nutrition-service.
- API Gateway proxy routes for hydration, plans, subscriptions, and feed.
- User app screens: Hydration, Explore, Paywall.
- Contracts examples for Phase 1.

## 20250830-1814 Phase 2
- Added Habit & HabitLog Prisma models.
- Implemented Habits REST (create/log/today) and Wearables ingestion.
- API Gateway proxies for habits, wearables, social compare.
- RN screens: Habits, SocialCompare + Today card.
- Contracts for Phase 2.

## 20250830-1820 Phase 3
- New activities-service (sessions/routes/summary) with Prisma models.
- New challenges-service (list/join/complete).
- API Gateway routes for activities and challenges.
- RN: Activities, Timer Suite, Challenges screens; GPX import helper.
- GPX sample data and contracts added.

## 20250830-1825 Phase 4
- New courses-service: course manifest, device-bound license, certificates (QR/metadata).
- New kpis-service: GET /v1/coach/kpis.
- New affiliate-service: affiliate dashboard + leaderboard.
- API Gateway routes for courses, certificates, KPIs, affiliate.
- RN: Course Player (offline, encrypted), Certificate QR viewer, VIP & Affiliate, Coach KPIs tabs.

## 20250830-1829 Phase 5
- New inbox-service: GET /v1/inbox, POST /v1/inbox/:id/read with Prisma model.
- Unification services: assessments-service & rewards-service (pluralized), list endpoints.
- API Gateway hardening: rate-limit, audit logs; new routes for inbox/assessments/rewards.
- Observability: Grafana dashboards + Prometheus alert rules.
- Security: Sealed-secrets templates & rotation policy docs.
- SBOM workflow (CycloneDX) + dependency review.

## 20250830-1844 Phase 10
- docker-bake.hcl for multi-service images; preview-bake workflow builds & deploys all services.
- Helm umbrella renders Deployments/Services for gateway & all backends.
- Prisma seeds for courses/assessments/rewards/medical/inbox with package scripts.
- Coverage Gate (>=80% lines/statements/functions; branches>=70%) wired in CI.
- OPA Gatekeeper constraints: required labels, forbid :latest, require readinessProbe.
- Battery benchmark harness for Android/iOS.

## 20250830-1850 Phase 12
- Grafana datasources for Tempo & Loki + traces dashboard.
- Structured log correlation (trace_id) in services.
- STRICT_CSP toggle in gateway (no 'unsafe-inline').
- Istio mTLS manifests and namespace label helper.
- PR QA comment workflow to summarize Lighthouse/Playwright/axe.

## 20250830-1853 Phase 13 (Final)
- Helm NetworkPolicies lock-down for gateway/backends.
- Ops Runbook with incident/rollback/secrets/perf sections.
- Repo validator script.

## 20250830-1854 Phase 13 (Final)
- NetworkPolicies deny-by-default + per-service allow.
- PodSecurity namespace labels (restricted).
- Ops Runbook (ONCALL.md) + secrets rotation & DB backup scripts.
- Release workflow (tag-based) + CODEOWNERS.
- Final Go-Live checklist.

## v96-final
- Compose healthchecks wired to /ready for all services
- Gateway OpenAPI (minimal) at app/gateway/openapi/openapi.yaml
- k6 smoke load test + manual GH workflow to run against any target
