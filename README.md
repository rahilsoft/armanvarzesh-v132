
# آرمان ورزش — پلتفرم مربی‌گری، تغذیه و حرکات اصلاحی (Monorepo)

این مخزن شامل **بک‌اند NestJS**، **اپلیکیشن‌های موبایل (React Native/Expo)** و **وب‌سایت Next.js** است که با معماری تمیز، امنیت سفت‌وسخت، و CI/CD یکپارچه توسعه داده شده‌اند.

> این نسخه بر اساس فازهای ۱ تا ۶ بازبینی و **بازسازی کامل** شده و شامل: ارتقاء وابستگی‌ها، بهبود امنیت (SanitizePipe, Gitleaks)، بهینه‌سازی Build و حجم، تست‌های واحد/ویجت/E2E، و مستندسازی دقیق است.

---

## ویژگی‌ها (Highlights)
- 💡 **Clean Architecture**: لایه‌های `domain/data/presentation`، جداسازی concerns.
- ⚙️ **NestJS + GraphQL/REST + Prisma/PostgreSQL** با **Redis** و **BullMQ**.
- 📱 **React Native (Expo)** برای اپ‌های کاربر و مربی + **Next.js** برای vitrin.
- 🔐 امنیت: **ValidationPipe + SanitizePipe**، **Rate-limit/Helmet** (در صورت فعال‌سازی)، **Gitleaks** در CI.
- 🧪 تست: Jest (Unit/Widget/E2E) برای Backend و RN.
- 🚀 CI/CD: **GitHub Actions** (Build/Test/Security) و راهنمای **Codemagic**.
- 📦 اندازهٔ خروجی کمتر: **inlineRequires**, حذف `console` در prod، بهینه‌سازی تصاویر (sharp/svgo).

---

## Tech Stack
- **Backend**: NestJS 11، GraphQL (code-first) + REST، Prisma ORM، PostgreSQL، Redis، BullMQ، WebSocket
- **Frontend**: React Native (Expo) + Next.js، Apollo Client، i18n
- **Storage/Media**: S3/MinIO، Sharp/FFmpeg
- **AI/ML**: Python + TensorFlow/PyTorch (SageMaker/GCP AI Platform) *(ماژول‌های ادغامی)*
- **Infra**: Docker, Kubernetes, Helm, Terraform، CDN/WAF
- **DevOps**: Monorepo با PNPM/Turborepo، GitHub Actions، CodeQL/Trivy (قابل‌افزودن)
- **Observability**: OpenTelemetry + Prometheus/Loki/Grafana *(در حال توسعه)*

---

## ساختار مونو‌ریپو
```
.
├─ apps/
│  ├─ backend/            # NestJS + GraphQL/REST + Prisma
│  ├─ user-app/           # React Native (Expo) – اپ کاربر
│  ├─ coach-app/          # React Native (Expo) – اپ مربی
│  └─ vitrin-site/        # Next.js وب‌سایت
├─ packages/
│  ├─ ui/                 # کتابخانهٔ UI مشترک (OptimizedText, DebouncedButton, hooks)
│  ├─ utils/              # ابزارهای مشترک (useStableCallback, dispose/newAbort, prefetchImage)
│  └─ state/              # store/state (Zustand + shallow selectors)
├─ .github/workflows/     # CI (از جمله security-gitleaks.yml)
├─ scripts/               # optimize-assets.mjs (sharp + svgo)
├─ pnpm-workspace.yaml
└─ package.json
```

---

## پیش‌نیازها
- **Node.js 20 LTS** (پیشنهاد)  
- **PNPM 9.x** (از طریق Corepack)
- **PostgreSQL 14+**، **Redis 6+** (برای اجرای کامل بک‌اند)

```bash
# فعال‌سازی Corepack و پین نسخهٔ pnpm
corepack enable
corepack use pnpm@9.6.0
```

---

## راه‌اندازی سریع (Quick Start)
```bash
# 1) نصب وابستگی‌ها
pnpm -w i

# 2) بهینه‌سازی اختیاری تصاویر و SVG ها
pnpm -w optimize:assets

# 3) آماده‌سازی پایگاه‌داده (Prisma)
cd apps/backend
pnpm prisma migrate deploy   # یا: pnpm prisma migrate dev

# 4) اجرای سرویس‌ها (مثال‌های متداول)
# Backend
pnpm -C apps/backend start:dev

# User app (Expo)
pnpm -C apps/user-app start

# Vitrin (Next.js)
pnpm -C apps/vitrin-site dev
```

> **نکته:** فایل‌های نمونهٔ env را از `*.example` کپی و مقداردهی کنید. کلیدهای حساس را هرگز در مخزن نگه ندارید.

---

## متغیرهای محیطی (نمونه‌های مهم Backend)
| متغیر | توضیح |
|---|---|
| `DATABASE_URL` | آدرس PostgreSQL (فرمت: `postgres://user:pass@host:5432/db`) |
| `REDIS_URL` | آدرس Redis |
| `JWT_SECRET`, `JWT_TTL` | توکن و TTL |
| `REFRESH_JWT_SECRET`, `REFRESH_JWT_TTL` | توکن رفرش و TTL |
| `ADMIN_USERS_JSON` | آرایه‌ای از `{{ u, h, r }}` برای ادمین‌ها؛ `h` هش bcrypt |

---

## تست‌ها
### Backend
```bash
# Unit
pnpm -C apps/backend test

# Coverage
pnpm -C apps/backend test:coverage

# Integration/E2E (Auth → Payments)
pnpm -C apps/backend test:e2e
```

### React Native (user-app)
```bash
pnpm -C apps/user-app test
```

---

## Build (محلی)
### Backend (NestJS)
```bash
pnpm -C apps/backend build
```

### Next.js (Production)
```bash
pnpm -C apps/vitrin-site build
pnpm -C apps/vitrin-site start
```

### React Native (Expo)
- از **EAS** یا **Codemagic** استفاده کنید. برای خروجی release Android، Gradle با **minifyEnabled/shrinkResources** پیکربندی شده است (در صورت وجود فولدر android/).

---

## CI/CD
### GitHub Actions
- امنیت: `security-gitleaks.yml` → اجرای Gitleaks روی هر `push/PR` با پیکربندی `.gitleaks.toml`
- می‌توانید workflow های build/test را مطابق ساختار Monorepo اضافه کنید (مثال):
```yaml
- name: Use Node
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'
- run: corepack enable && corepack use pnpm@9.6.0
- run: pnpm -w i
- run: pnpm -C apps/backend test
```

### Codemagic (راهنما)
- Node 20 LTS، فعال‌سازی Corepack، `pnpm -w i`
- Build وب/بک‌اند/موبایل بر اساس workflow دلخواه.
- کش PNPM و gradle/cocoapods را فعال کنید.  
- برای Android/iOS از متغیرهای امن جهت keystore/provisioning استفاده کنید.

---

## امنیت
- **SanitizePipe** + **ValidationPipe**: حذف کلیدهای خطرناک و بررسی دقیق DTO ها.
- **Cache-Control** (اختیاری): `@cacheControl(...)` برای GETها.
- **Gitleaks**: روی هر commit/PR اجرا می‌شود؛ کلیدها را در Secrets نگه دارید.
- **.gitignore** سخت‌تر شده؛ فایل‌های حساس (`*.pem`, `*.keystore`, `google-services.json`, …) نادیده گرفته می‌شوند.

---

## راهنمای عیب‌یابی (Troubleshooting)
- **ERR_PNPM_NO_MATCHING_VERSION (@nestjs/passport@^10 → 11.0.5):**  
  نسخهٔ `@nestjs/passport` را به **11.0.5** پین کنید و `pnpm up -r` بزنید.
- **ERR_PNPM_NO_OFFLINE_META (typescript@>=5.5 <6):**  
  حالت آفلاین/کش محلی CI را خاموش کنید، TypeScript را به **۵.۶.x** پین و **lockfile** را commit کنید.
- **Install workspace dependencies (lockfile-aware):**  
  `pnpm-lock.yaml` ریشه را commit و در CI از `pnpm -w i` استفاده کنید.
- **Corepack pnpm download:**  
  در CI: `corepack enable && corepack use pnpm@9.6.0` + کش فعال.
- **Deprecated apollo-server-express@3:**  
  به **@apollo/server (v4)** مهاجرت کنید (در این پروژه مسیر مهاجرت فراهم شده است).

---

## قراردادهای کدنویسی
- ESLint + Prettier فعال؛ قوانین امنیتی: `no-eval`, `no-implied-eval`, `@typescript-eslint/no-implied-eval`  
- React performance hints: `react/jsx-no-bind`, `react/no-array-index-key`, `react/jsx-no-constructed-context-values`
- UI/State: از `useStableCallback`، `selector + shallow` استفاده کنید.

---

## اسکریپت‌های مفید
```bash
# بهینه‌سازی تصاویر/SVG در کل مخزن
pnpm -w optimize:assets
# آنالیز باندل Next.js
pnpm -C apps/vitrin-site analyze
```

---

## مجوزها (Permissions)
- **Android**: فقط `INTERNET` و `ACCESS_NETWORK_STATE` در حالت پایه + `usesCleartextTraffic=false` (در Release)  
- **iOS**: ATS سخت‌گیر (`NSAllowsArbitraryLoads=false`)، توضیح مجوزهای دوربین/گالری (در صورت استفاده)

---

## حق مؤلف
© 2025 Arman Varzesh.

## CI/CD — Unified Pipeline

This repository uses GitHub Actions with the following required checks per PR:
- `Unified CI / Lint • Typecheck • Unit/Integration`
- `Unified CI / Build (packages & apps)`
- `SBOM • SCA • SAST`
- `Secret Scan` (Gitleaks), `CodeQL`, `Container Scan (Trivy)`
- Optional: `Lighthouse` (set `LHCI_URLS` env to enable)

Use Node 20 and pnpm 9. Cache is enabled through setup-node and pnpm action.
## Documentation
See [docs/README.md](docs/README.md) for runbooks, API docs, and ADRs.



| Script | Command |
|---|---|
| `audit` | `pnpm audit --audit-level=high || true` |
| `audit:full` | `pnpm audit` |
| `audit:prod` | `pnpm audit --prod` |
| `build` | `pnpm -r run build` |
| `build:all` | `pnpm -r build --no-cache` |
| `build:backend` | `pnpm --filter ./app/backend run build` |
| `build:coach` | `pnpm --filter ./app/coach-app run build || true` |
| `build:user` | `pnpm --filter ./app/user-app run build || true` |
| `build:vitrin` | `pnpm --filter ./app/vitrin-site run build` |
| `changeset` | `changeset` |
| `check:dups` | `node scripts/detect-duplicates.mjs | jq 'keys' && test $(node scripts/detect-duplicates.mjs | jq 'keys | length') -eq 0` |
| `check:repo` | `node scripts/verify-clean.mjs` |
| `check:score` | `node scripts/score.mjs > .reports/score.json && cat .reports/score.json | jq 'map(.s) | {min:(min),avg:(add/length),max:(max)}'` |
| `clean` | `rimraf dist || true` |
| `coverage` | `pnpm -r run coverage` |
| `coverage:all` | `pnpm -r run coverage` |
| `coverage:check` | `node scripts/check-coverage.js` |
| `coverage:report` | `pnpm -r test -- --coverage` |
| `db:init:plan` | `echo 'Run per-service migrations/PLAN_stage08/db_init.sh'` |
| `dev` | `nodemon --exec ts-node src/main.ts || echo "dev script placeholder"` |
| `e2e:backend` | `node scripts/e2e-backend.mjs` |
| `env:collect` | `node tools/env/collect-env.cjs` |
| `format` | `prettier -w .` |
| `format:check` | `prettier -c .` |
| `lint` | `pnpm -r run lint` |
| `lint:all` | `pnpm -r lint` |
| `lint:fix` | `eslint . --ext .ts,.tsx,.js,.jsx --fix` |
| `lint:repo` | `eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0` |
| `openapi:validate` | `node scripts/validate-openapi.mjs` |
| `optimize:assets` | `node scripts/optimize-assets.mjs` |
| `perf:smoke` | `npx autocannon -d 10 -c 50 http://localhost:3000/health || true` |
| `perf:smoke:slow` | `npx autocannon -d 20 -c 100 http://localhost:3000/health || true` |
| `postinstall` | `echo ok` |
| `prepare` | `husky install || true` |
| `prisma:generate` | `prisma generate` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:studio` | `prisma studio` |
| `publish-packages` | `changeset publish` |
| `sbom` | `pnpm dlx @cyclonedx/cyclonedx-npm --output-file sbom.json` |
| `sbom:all` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `scan:deps` | `pnpm audit --audit-level=high || true` |
| `scan:secrets` | `gitleaks detect --no-git -v || true` |
| `secret-scan` | `pnpm dlx gitleaks detect --no-git -v || true` |
| `smoke` | `node scripts/smoke-security.mjs` |
| `start` | `node dist/main.js || next start -p 3000 || echo "no start"` |
| `start:prod` | `node dist/main.js` |
| `test` | `pnpm -r run test` |
| `test:all` | `pnpm -r test -- --ci` |
| `test:cov` | `pnpm -r test:cov` |
| `test:e2e` | `echo "e2e placeholder"` |
| `test:e2e:flow` | `node -e "console.log('Configure jest with tools/e2e/jest.config.e2e.js')"` |
| `test:repo` | `jest --ci --coverage --runInBand` |
| `typecheck` | `pnpm -r run typecheck` |
| `typecheck:all` | `pnpm -r typecheck` |
| `version` | `changeset version` |
| `version-packages` | `changeset version` |

## Environment
Use `.env` or inherit from repo root. Required variables (examples):
- `DATABASE_URL` — Postgres connection string
- `REDIS_URL` — Redis connection string
- `JWT_SECRET` — JWT signing secret
- `CORS_ORIGIN` — Comma-separated origins (e.g. https://app.example.com,https://admin.example.com)

## Development
- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Tests: `pnpm run test` (coverage: `pnpm run coverage`)

## Deployment
- Containerized via Dockerfile (if present). Healthcheck: `GET /health`, Metrics: `GET /metrics` (Prometheus).
- See repo Release workflow for build & publish (GHCR).

## Security
- No secrets in repo. Use env variables or secret manager. Helmet/CORS configured in Nest/Next.

---
_This README was scaffolded in Phase 8 (Docs) to standardize documentation across the monorepo._
