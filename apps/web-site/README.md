# Vitrin / Landing (Apple‑style)

این سایت vitrin مطابق راهنمای «طراحی و پیاده‌سازی سایت آرمان ورزش» بازطراحی شد:
- Hero با شعار کوتاه و CTA «شروع کن / بیشتر بدانید»
- روایت اسکرول با سکشن‌های ویژگی‌ها
- انیمیشن‌های ظریف (در نسخه‌های بعد)
- تصاویر Retina/Responsive + فرمت‌های WebP/AVIF (مرحله‌ی بعد، media-worker)
- SEO/Schema + OpenGraph
- بودجه‌های Lighthouse: Performance ≥ 90, Best‑Practices ≥ 95, SEO ≥ 95

## اجرا
```bash
pnpm i
pnpm --filter vitrin-site dev
# یا برای تولید:
pnpm --filter vitrin-site build && pnpm --filter vitrin-site start
```

## Definition of Done (v1)
- [x] صفحه‌ی خانه با Hero، Features و CTA
- [x] lighthouserc.json معتبر با بودجه‌ها
- [ ] تصاویر بهینه و روایت تعاملی (در فاز بعد)
- [ ] Schema.org + FAQ + Pricing (در فاز بعد)


## Vitrine Tile Builder (baseline)
This site now reads tiles from `content/vitrine.tiles.json` and renders a showcase grid on the home page.
- Edit JSON to change tiles (title/subtitle/cta/media).
- Animations are scroll-triggered and can be tuned per tile.
- A basic analytics endpoint exists at `/api/analytics`.

Security headers and a Lighthouse CI workflow have been added. Set `NEXT_PUBLIC_GRAPHQL_URL` to point at your Gateway when ready.


## Admin CMS (Tiles) — Dev Preview
- UI: `/admin/cms` — برای ورود، یک درخواست POST به `/api/admin/login` با `token=ADMIN_TOKEN` ارسال می‌شود و کوکی تنظیم می‌شود.
- API: `GET/PUT /api/admin/tiles` — ذخیره‌سازی فایل در `content/vitrine.tiles.json` (در محیط تولید باید به سرویس admin-cms متصل شود).
- ENV: `ADMIN_TOKEN` (پیش‌فرض devtoken)

## i18n (ساده، cookie-based)
- کوکی `lang` بین `fa` و `en` ذخیره می‌شود (`?lang=fa` یا `?lang=en`).
- `document.dir` به صورت خودکار `rtl/ltr` می‌شود.


## Remote Tiles via content-service
- Set `NEXT_PUBLIC_CONTENT_SERVICE_URL` to GraphQL endpoint of `content-service`.
- Query used: `query { vitrineTiles { id type title{fa en} subtitle{fa en} cta{href label{fa en}} media{kind src alt{fa en}} animation{trigger effect durationMs} metricsKey } }`

## Lottie/Video Support
- `media.kind='lottie' | 'video' | 'image'`. Lottie loads lazily via `lottie-web`.


## Admin CMS (Production wiring — GraphQL)
- Set `NEXT_PUBLIC_CONTENT_SERVICE_URL` to content-service GraphQL endpoint.
- Admin UI now uses GraphQL:
  - Query: `tiles(page:"home")`
  - Mutation: `upsertTile(input:{ page, type, data(JSON), actorId })`
- Set a temporary admin token in the UI (stored in `localStorage`) to call protected mutations (dev-only).


## A/B Testing (frontend)
- A cookie `abid` assigns a stable seed per visitor.
- `selectVariants()` groups tiles by logical id and chooses a variant by weight.
- Provide multiple variants from backend (same `data.id` with different `variant` and `weight`).

## E2E (Playwright)
- Config at `apps/vitrin-site/e2e/playwright.config.ts`
- Run locally: `pnpm --filter vitrin-site dev` and in another shell: `npx playwright test apps/vitrin-site/e2e`


## Analytics → ClickHouse (collector)
- Set `NEXT_PUBLIC_ANALYTICS_URL` to analytics-collector base URL (e.g., `http://localhost:8088`).
- Events fired:
  - `pageview` (implement in your layout if needed)
  - `tile_impression` (on reveal)
  - `tile_click` (on CTA click)
- Collector service at `services/analytics-collector/`. Run and create ClickHouse table via `queries/events.sql`.

## Preview (Draft)
- Add `?preview=<token>` to URLs; frontend forwards `X-Preview-Token` header to content-service and requests `includeDraft: true`.
- In production, validate `X-Preview-Token` in content-service (e.g., compare with `PREVIEW_TOKEN` env + IP allowlist).


## Media Upload (Admin CMS)
- Set `NEXT_PUBLIC_MEDIA_CDN` to your CDN/public bucket origin (e.g., `https://cdn.example.com`).
- In `/admin/cms`, choose a file → we request `getSignedUpload` from content-service → PUT to S3 → media.src set to public URL.

## Responsive Images
- `TileCard` uses Next `<Image>` with `sizes="(max-width: 960px) 100vw, 60vw"`.

## Variant Analytics
- `tile_impression`/`tile_click` now include `{ variant, order }` for CTR and scroll-depth dashboards.


## Admin SSO (OIDC) — PKCE
- ENV (frontend):
  - `NEXT_PUBLIC_OIDC_AUTH_URL`, `NEXT_PUBLIC_OIDC_TOKEN_URL`, `NEXT_PUBLIC_OIDC_CLIENT_ID`, `NEXT_PUBLIC_OIDC_REDIRECT_URI` (default `/admin/callback`), `NEXT_PUBLIC_OIDC_SCOPE`
- مسیرها:
  - `/admin/login` → شروع PKCE
  - `/admin/callback` → تبادل کد و ذخیرهٔ idToken در cookie/localStorage
- Middleware مسیرهای `/admin/*` را بدون توکن نمی‌گذارد (سخت‌گیری اصلی با RolesGuard در backend).

## Conversion Tracing
- Helperها: `logPageview`, `logConversion(step, ctx)`
- صفحات نمونه: `/cta/signup` و `/cta/download` (برای تست قیف).
- توصیه: در مقصد واقعی ثبت‌نام/دانلود، رویداد `signup_complete` یا `app_download` را فراخوانی کنید.

## Showcase — Device Mock & Scroll-driven Video
- `DeviceMock` برای شاسیِ زیبا (الهام از دستگاه‌های مدرن)
- `ScrollVideo` زمان ویدیو را با اسکرول هدایت می‌کند (degrade روی reduced-motion)
- `TileCard.media.kind` اکنون `scrollvideo` را هم می‌پذیرد.


## Hero Parallax
- محتوا در `content/hero.json`؛ در صورت نیاز می‌توان از CMS واقعی هم تغذیه کرد.

## JWKS Verification (Admin routes)
- `NEXT_PUBLIC_OIDC_JWKS_URL`، `NEXT_PUBLIC_OIDC_ISSUER`, `NEXT_PUBLIC_OIDC_AUDIENCE` را ست کنید تا middleware توکن را validate کند.

## Media Pipeline
- `content-service` دارای Query `makeImageVariants(url)` است که `blurDataURL` تولید می‌کند.
- Admin CMS پس از آپلود، blur را روی کاشی تنظیم می‌کند تا LCP نرم‌تر شود.


## Narrative Sections
- محتوا در `content/narrative.json`؛ هر گره شامل عنوان/بدنه/مدیاست.
- کامپوننت `Narrative` با IntersectionObserver ظاهرشدن گام‌ها را نرم می‌کند.

## A11y Guardrail
- تست Playwright + `@axe-core/playwright` → `e2e/tests/a11y.spec.ts`

## Web Vitals
- `initWebVitals()` در شروع ناوبری اجرا می‌شود و مقادیر LCP/CLS/INP/TTFB را به analytics می‌فرستد.


## SEO & A11y
- `app/sitemap.ts` و `app/robots.ts` آماده شد؛ `NEXT_PUBLIC_SITE_URL` را ست کنید.
- JSON-LD (Organization) در `<head>` تزریق می‌شود.
- Skip-link و focus-visible سفارشی اضافه شد.

## Release Ops
- Content-service دارای `/healthz` و `/ready` برای Blue/Green/Canary استقرار.


## Admin — Audit UI
- مسیر: `/admin/audit` — فهرست رخدادهای انتشار/ویرایش + مقایسهٔ Diff دو نسخه (JSON diff محتوایی).

## SEO پیشرفته
- JSON-LD «WebSite» + «ItemList» برای vitrine tiles؛ Organization از قبل در layout بود.
- ARIA: hero (banner), narrative (region), grid (aria-label).

## CDN Caching
- فایل‌های AVIF/WebP با Cache-Control `public, max-age=31536000, immutable` روی S3 بارگذاری می‌شوند (resolver variants).


## Feature Flags
- Backend: `featureFlags` + `setFeatureFlag(key, value)` در GraphQL.
- Frontend: `FlagsProvider` + `useFlag(key)` و کامپوننت `Gate`.
- Admin: `/admin/flags` برای مشاهده/تغییر فلگ‌ها.

## UTM Attribution
- در نخستین بازدید، UTM از URL گرفته و در کوکی `utm` ذخیره می‌شود؛ سپس به payload تمام رویدادها افزوده می‌شود.
- Queries آماده در ClickHouse: `ctr_by_utm.sql`، `ab_significance.sql`.

## Typography & Baseline
- Variable font-ready با `font-variation-settings`; baseline grid 8px.

## Deploy
- قالب Blue/Green در `deploy/k8s/` + راهنمای rollout.


## Variable Font (Brand)
- فایل فونت را در مسیر `apps/vitrin-site/public/fonts/ArmanVF.woff2` قرار دهید.
- CSS از `font-variation-settings` برای `opsz` و `wght` استفاده می‌کند (قابل تنظیم در :root).


## Metrics API (Next)
- مسیر: `/api/metrics?name=<ctr_per_tile|conversion_from_tile|ab_significance|ctr_by_utm|webvitals_p95>`
- ENV:
  - `CLICKHOUSE_URL` (مثلاً `http://localhost:8123`)
  - `CLICKHOUSE_DB` (پیش‌فرض: `default`)
  - `CLICKHOUSE_USER` / `CLICKHOUSE_PASSWORD`


## Admin — Exercises
- مسیر: `/admin/exercises` بارگذاری ویدئو + صف تأیید.

## Anatomy 3D (Placeholder)
- مسیر: `/anatomy` — تا اتصال مدل سه‌بعدی واقعی، انتخاب عضله را شبیه‌سازی می‌کند.


### Admin: Taxonomy
- مسیر: `/admin/taxonomy` — مدیریت رشته‌ها، تجهیزات، و عضلات (code/name). این داده‌ها در فرم افزودن ویدئو استفاده می‌شوند.


### Coach Calendar (PWA)
- مسیر: `/coach/calendar/[clientId]` — نمایش جلسات تولیدشده برای مربی.


### Anatomy 3D — پیام به موبایل
- با انتخاب عضله در `/anatomy`، پیام با `window.ReactNativeWebView.postMessage` به اپ ارسال می‌شود.


### Admin — Anatomy Map
- مسیر: `/admin/anatomy-map` برای مدیریت مدل سه‌بعدی و نگاشت نام Mesh→کد عضله (جداگانه برای زن/مرد).


### Anatomy 3D — تجربهٔ حرفه‌ای
- Sidebar: جستجو، عضلات محبوب (Favorites با localStorage)، کلیک روی عضله → هایلایت چندگانه + ارسال به اپ موبایل.


### Execution (PWA)
- `/me/today?clientId=...` — جلسات امروز کاربر
- `/me/session/[id]?clientId=...` — اجرای جلسه: نمایش بلوک‌ها، تایمر EMOM/HIIT، ثبت ست‌ها


### Plan Preview
- `/plan/preview/[id]` — نمایش ساختار کامل برنامه برای اشتراک با کاربر/مربی.


### Admin — Approvals
- در `/admin/exercises` می‌توانید ویدئوها را تایید/رد کنید (برای محیط واقعی هدر `x-role: admin` را بفرستید).


### Coach Tools
- `/coach/tools` — ابزار اعتبارسنجی برنامه و شبیه‌سازی زمان جلسه


### Coach Reorder (PWA)
- `/coach/reorder/[dayId]` — Drag & Drop HTML5 برای چیدن بلوک‌های روز و ذخیرهٔ ترتیب.


### Session Notes (PWA)
- در `/me/session/[id]` می‌توانید یادداشت متنی ثبت یا صوت ضبط/آپلود کنید.

### Coach Scheduler
- `/coach/scheduler/[assignmentId]` برای تولید خودکار زمان‌بندی یک‌ماهه (startDate, sessionsPerWeek, restDays).


### Auth (Dev)
- `middleware.ts` مسیرهای `/coach/*`, `/admin/*`, `/me/*` را محافظت می‌کند (با `SKIP_AUTH=1` غیرفعال می‌شود).
- `/login` صفحهٔ ورود توسعه: کوکی `access_token` ست می‌کند. برای پروداکشن باید به auth-service متصل شود.

### Coach Analytics
- `/coach/analytics` — پایبندی، تمرین‌های محبوب، بار تمرینی هفتگی.


### Coach — Quick Block Builder
- `/coach/quick-block/[dayId]` انتخاب چند حرکت از Library و ساخت فوری بلوک (SINGLE/SUPERSET/TRISET/CIRCUIT) با rounds/restBetween/protocol.



| Script | Command |
|---|---|
| `analyze` | `ANALYZE=true next build` |
| `build` | `next build` |
| `build-storybook` | `storybook build` |
| `clean` | `rimraf dist || true` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `next dev` |
| `e2e` | `playwright test` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx` |
| `prepare` | `husky install || true` |
| `prisma:generate` | `prisma generate` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:studio` | `prisma studio` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `seo:audit` | `echo 'Run lighthouse locally'` |
| `sitemap` | `next-sitemap` |
| `start` | `next start` |
| `start:prod` | `node dist/main.js` |
| `storybook` | `storybook dev -p 6006` |
| `test` | `jest --passWithNoTests` |
| `test:cov` | `jest --coverage` |
| `test:e2e` | `echo "e2e placeholder"` |
| `typecheck` | `tsc -p tsconfig.json --noEmit || echo 'no tsconfig'` |

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
