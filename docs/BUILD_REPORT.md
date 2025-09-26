# UI/UX Build — Phase A (Foundation + Booking)
Date: 2025-08-31 16:42 (Europe/Amsterdam)

## Included
- Shared tokens (CSS + RN theme)
- Shared UI components (Button, Card)
- i18n (fa/en) — booking & common
- Data layer (booking): schemas, adapter (mock/API switch), hooks
- Web booking page (Next pages/)
- Admin booking table
- RN screens: User (Create/List/Detail), Coach (Schedule/Report)
- Smoke tests placeholders

## How to switch API
Set `DATA_MODE=api` to call `/api/bff/booking/*` endpoints.
Default is mock for offline dev.

## Next candidate features
- payments, nutrition, analytics



## Phase B — Payments + Nutrition
Date: 2025-08-31 16:47

Included:
- Payments: wallet, add funds, pay (mock/api switch)
- Nutrition: plan view, meal log
- Web pages: /payments, /nutrition
- Admin modules: PaymentsTable, NutritionPlansTable
- RN User: Wallet, Checkout, MealPlan, MealLog
- RN Coach: Payouts (display), CoachNutritionAssign (stub UI)
- i18n (fa/en), smoke tests

Switch real API by setting `DATA_MODE=api`.


## Phase C — Analytics + Notifications (+ PWAs)
Date: 2025-08-31 16:52

Included:
- Analytics: KPIs & Weekly series (mock/api switch)
- Notifications: Inbox, Mark-all, Enable Push
- Web pages: /analytics, /notifications
- Admin: AnalyticsDashboard, BroadcastCenter
- RN User: AnalyticsScreen, NotificationsScreen, NotificationSettingsScreen
- RN Coach: CoachAnalyticsScreen, CoachNotificationsScreen
- PWAs: user/coach Analytics + Notifications feature components
- i18n (fa/en), smoke tests for all surfaces


## Phase D — Chat + Courses (Academy)
Date: 2025-08-31 16:57

Included:
- Chat: threads, messages, send, mark-read (mock/api)
- Courses: list, detail, enroll (mock/api)
- Web: /chat, /courses, /course/[id]
- Admin: Chat Moderation, Courses Manager
- RN User: ChatList/ChatRoom, Courses/CourseDetail
- RN Coach: CoachChatList/Room, CoachCourses
- PWAs: chat & courses components (user/coach)
- i18n (fa/en), smoke tests


## Phase E — Workouts + Assessments (+ Physio hooks)
Date: 2025-08-31 17:03

Included:
- Workouts: plan, session, complete (mock/api)
- Assessments: list, detail/fill, submit (mock/api)
- Physio: prescriptions list (mock/api)
- Web: /workouts, /workout/[id], /assessments, /assessment/[id], /physio
- Admin: WorkoutsManager, AssessmentsManager, PhysioCases
- RN User: WorkoutPlan/Session/ExerciseDetail, Assessments list/fill, Physio
- RN Coach: AssignWorkout (stub), ReviewAssessments, PrescribePhysio (stub)
- PWAs: Workouts & Assessments components (user/coach)
- i18n (fa/en), smoke tests


## Phase F — Marketplace + Coaches Directory/Profile + Reviews
Date: 2025-08-31 17:09

Included:
- Marketplace: list, product detail, cart, checkout (mock/api)
- Coaches: directory + profile (mock/api)
- Reviews: list/create for coach/product (mock/api)
- Web: /marketplace, /product/[id], /coaches, /coach/[id], /reviews
- Admin: ProductsManager, CoachesManager, Reviews Moderation
- RN User: Shop/ProductDetail, CoachesDirectory/CoachProfile, Reviews list/create
- RN Coach: Orders (demo), Roster (demo), CoachReviews
- PWAs: marketplace & coaches components (user/coach)
- i18n (fa/en), smoke tests


## Phase G — Payroll + Rewards/VIP/Affiliate + Challenges
Date: 2025-08-31 17:15

Included:
- Payroll (coach payouts summary) — data & Web/Admin & RN Coach
- Rewards (points earn/redeem) — data & Web/Admin & RN/PWA
- VIP (tiers & progress) — data & Web/Admin & RN
- Affiliate (referral code & commission) — data & Web/Admin & RN
- Challenges (list/join + leaderboard) — data & Web/Admin & RN/PWA
- i18n (fa/en) + smoke tests
- Still mock/api switchable via `DATA_MODE`


## Phase H — Security/Role Guards + Test Coverage + i18n/a11y audits
Date: 2025-08-31 17:32

What changed:
- RBAC core: `packages/security/rbac.ts` (+ guards for web/RN)
- Auth context: `packages/auth/context.tsx` + demo role switcher `/debug/roles`
- Sensitive pages wrapped with <Guard>: `/payroll`, `/affiliate`, `/vip`, `/challenges`
- Tests: `__tests__/security.*` (RBAC logic + Guard render paths)
- Audits: `tools/audit/i18n-audit.mjs`, `tools/audit/a11y-check.mjs`
- Artifacts: `reports/rbac-matrix.json`, `reports/i18n-report.json`, `reports/a11y-report.json`

How to run audits locally:
```bash
node tools/audit/i18n-audit.mjs . reports/i18n-report.json
node tools/audit/a11y-check.mjs . reports/a11y-report.json
```


## Phase I — Notifications + Live/LiveKit hooks + Observability
Date: 2025-08-31 17:36

Included:
- Observability: logger/otel mock + ErrorBoundary + fetcher wrapper (trace header)
- Notifications: list/mark-read/register-device (mock/api), Web/RN/Admin/PWA UIs
- Live: list/create room (mock/api), Web/Admin/RN UIs
- Tests: notifications, live, observability
Notes: replace otel mock with @opentelemetry/api in prod; connect adapters to BFF endpoints.


## Phase J — Payments (Gateway + Wallet) + Web Checkout + Admin Settlements
Date: 2025-08-31 17:42

Included:
- Payments: createIntent/confirm/tokenize/listCards/settlements (mock/api) — data hooks + Web Checkout + RN Checkout
- Wallet: get/topup/withdraw/history — Web/RN/PWA UIs
- Admin: Payments/Settlements module
- i18n: fa/en for payments & wallet
- Tests: payments + wallet adapters (mock)
Notes: wire BFF endpoints `/api/bff/payments/*` and `/api/bff/wallet/*` for real integration.


## Phase K — CMS/Content + Blog/SEO Kit + Static Pages & Status
Date: 2025-08-31 17:45

Included:
- CMS data: posts/pages (mock/api) + hooks
- SEO Kit: <Meta/> head tags + JSON-LD helpers (article/org)
- Blog: /blog, /blog/[slug] with structured data
- Static Pages: /about, /contact, /pricing
- Status Page: /status pulling services snapshot
- A11y: SkipLink component
- Public: robots.txt, sitemap.xml
- Tests: cms adapter + seo schema


## Phase L — Assessments/Health + Physio + Surveys
Date: 2025-08-31 17:51

Included:
- Assessments: multi-step template, draft (localStorage), submit, list submissions
- Physio: protocols list, assign plan, list plans
- Surveys: NPS + text; validation + submit
- UI: FormStepper + FormField
- Web: /assessments, /physio, /surveys/[id]
- RN: AssessIntro/AssessForm, PhysioForm, SurveyScreen; Coach views
- PWA: Assessments teaser
- Tests: adapters for all three domains
Notes: Map to BFF endpoints /api/bff/assessments/*, /api/bff/physio/*, /api/bff/surveys/* for real data.


## Phase M — Chat Realtime + Inbox Service + Media Worker
Date: 2025-08-31 17:56

Included:
- Chat data: ws mock + adapters + hooks (connect/onMessage/sendText/sendMedia/listRooms)
- Web: /chat با فهرست گفتگوها، ارسال متن/مدیا
- Admin: Inbox module (آخرین پیام‌ها)
- RN: ChatScreen برای User/Coach
- PWA: Chat ساده
- Media: upload/transcode mock در packages/media/*
- Tests: chat realtime + media upload
Notes: برای اتصال واقعی، WS را به gateway (socket.io یا ws) متصل کنید و upload را به media-worker.


## Phase O — E2E (Playwright) + CI + Feature Flags + Env
Date: 2025-08-31 18:04

Included:
- Playwright config + 4 e2e specs (checkout, live, chat, cms)
- GitHub Actions CI (vitest + next build + e2e)
- Feature Flags: config + runtime adapter via env
- Env samples: .env.example + .envrc
- README bootstrap


## Phase P — Coaches Directory/Profile + Matching + Reviews
Date: 2025-08-31 18:09

Included:
- Coaches: list/get/update (mock/api) + filters
- Matching: simple scorer based on goals/tags/gender/price/rating
- Reviews: list/add/moderate with 'pending' default for new reviews
- Web: /coaches, /coaches/[id], /apply-coach
- RN: CoachesList, CoachProfile, CoachProfileEdit
- PWA: Coaches list
- Admin: Coaches Directory + CoachDetail + Reviews Moderation
- i18n: fa/en for coaches & reviews
- Tests: adapters for coaches/matching/reviews
Notes: wire BFF endpoints /api/bff/coaches/* and /api/bff/reviews/* for prod.


## Phase Q — Workouts + Programs + Schedules
Date: 2025-08-31 18:14

Included:
- Workouts: exercises/workouts/session lifecycle (start/log/complete)
- Programs: list/get/create with simple weekly plan
- Schedule: list/add/setStatus
- Web: /workouts, /workouts/[id], /programs, /schedule
- RN: WorkoutsList/Detail/Session, Schedule; Coach ProgramBuilder/Assign
- PWA: Workouts list
- i18n: fa/en for workouts/programs/schedule
- Tests: adapters for workouts/programs/schedule
Notes: BFF endpoints to wire: /api/bff/workouts/*, /api/bff/programs/*, /api/bff/schedule/*


## Phase R — Nutrition + Meal Plans + Marketplace + Cart
Date: 2025-08-31 18:20

Included:
- Nutrition: foods/meals list/get/create (mock/api) + web /nutrition & /meals/[id]
- Meal Plans: list + assign (coach) hooks
- Marketplace: product list/get + web /marketplace
- Cart: add/setQty/clear + web /cart → Checkout button (wired to Phase J)
- RN: NutritionScreen, MealPlanScreen, ShopScreen, CartScreen; Coach AssignMealPlan/ManageProducts
- PWA: Marketplace + Cart
- Admin: NutritionManager; Marketplace Catalog/Products
- i18n: fa/en for nutrition/marketplace/cart
- Tests: adapters for nutrition/mealplans/marketplace/cart
Notes: BFF endpoints to wire: /api/bff/nutrition/*, /api/bff/mealplans/*, /api/bff/marketplace/*, /api/bff/cart/*


## Phase S — Notifications Push + In-App Inbox + Email/SMS Templates
Date: 2025-08-31 18:24

Included:
- Notifications data: registerDevice/getPrefs/setPrefs/listFeed/markRead
- Inbox data: threads/items/markRead
- Web: /notifications + /settings/notifications (toggle push/email/sms) + public/sw.js (mock push)
- RN: InboxScreen + SettingsScreen
- PWA: Notifications feature
- Admin: notifications/Templates + Campaigns (سیم‌کشی به BFF در آینده)
- Templates: packages/templates/email/{welcome,receipt}.html + sms/{otp,promo}.txt
- Tests: notifications.adapter.spec.ts + inbox.adapter.spec.ts
Notes: برای تولید واقعی، BFF را به پیام‌رسان/ایمیل/SMS (FMS/SES/Kaveh/SMS.ir) متصل کنید و VAPID keys را مقداردهی نمایید.


## Phase T — Observability + Error Boundaries + Status
Date: 2025-08-31 18:38

Included:
- Observability: lightweight tracer (console + localStorage), OTEL bridge placeholder, fetch() patch for auto spans
- UI: global ErrorBoundary via _app.tsx
- Web: /status (health checks + recent traces + env)
- Admin: Observability/Logs viewer
- Tests: observability.trace.spec.ts
Notes: Replace packages/observability/* with real @opentelemetry/* SDK when backend collector is ready.


## Phase U — Security Hardening (CSP, SameSite, RBAC, PII Masking)
Date: 2025-08-31 18:40

Included:
- CSP headers via Next config; Permissions/Referrer policies; COOP
- Middleware gate for /checkout, /wallet, /admin (demo cookie `av_role`, SameSite=Lax)
- RBAC policy + React Guard component
- PII masking helpers (email/phone) for safe logging
- Lightweight Auth context for role propagation
- Security CI workflow (weekly audit + tests)
- SECURITY.md with production checklist


## Phase U — Security Hardening (CSP / SameSite / RBAC / Validation)
Date: 2025-08-31 18:44

Included:
- Security headers + CSP via middleware and Next headers
- RBAC table + React Guard
- Validation helpers (text/number sanitization & checks)
- Admin app guard wrapper + protected sample page
- Tests: RBAC + validation
Notes: tighten CSP by removing 'unsafe-inline' after refactoring legacy inline styles/scripts.


## Phase V — Accessibility (A11y) + Performance Polish
Date: 2025-08-31 18:48

Included:
- ESLint a11y rules + repo-wide ignore
- UI components: VisuallyHidden, AccessibleButton, SkipLink, Img (enforce alt & lazy)
- Web: _document.tsx with lang/dir and preconnect/preload
- Tools: tools/audit/a11y-check.mjs (img alt, anchor href, document lang/dir)
- Lighthouse CI: .lighthouserc.json + workflow
- Next image/perf tweaks in next.config.js (if absent)
- Tests: a11y/security utilities
Action: run `node tools/audit/a11y-check.mjs . reports/a11y-report.json` and fix any flagged files.


## Phase W — GA Release Checklist + 2-week Roadmap + Runbooks + Smoke
Date: 2025-08-31 18:51

Included:
- GA_RELEASE_CHECKLIST.md + ROADMAP_2WEEKS.md
- Runbooks: incident / rollback / oncall
- Machine-readable tasks: ops/ga_tasks.json + ops/ga_tasks.csv
- Tools: smoke.mjs, env/validate.mjs, db/migrate_example.sql
- Makefile shortcuts + .github templates (PR/Issue) + CODEOWNERS
- RTL HTML summary: reports/ga_summary.html
