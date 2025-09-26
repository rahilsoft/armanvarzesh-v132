
# ArmanVarzesh Coach App

This is the official mobile app for coaches in the ArmanVarzesh platform.

## Features
- Coach Login, Registration, Profile
- Manage Clients, Review and Approve Workouts
- Plan Builder, Challenge Management
- Analytics, Payment, Live Sessions and more

## Getting Started
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Run `npm install`
- Start the project: `npm start`
    

## Authentication & Onboarding (Coach App)
- ENV:
  - `EXPO_PUBLIC_GRAPHQL_HTTP=https://api.armanfit.com/graphql`
  - `EXPO_PUBLIC_REFRESH_ENABLED=false` (در صورت پشتیبانی بک‌اند از Refresh، `true` شود)
- ذخیره‌سازی امن نشست: `expo-secure-store` در `utils/secure.ts`
- Route Guard کامل: `src/AppNavigator.tsx` با Splash و سوییچ Auth/Main بر مبنای توکن
- Apollo Client: `graphql/client.ts` با authLink و خواندن توکن از tokenStore
- فرم‌ها:
  - `components/Auth/LoginForm.tsx` با Mutation `LOGIN_COACH`
  - `components/Auth/RegisterForm.tsx` با Mutation `REGISTER_COACH`
- کانتکست:
  - `context/AuthContext.tsx` با `login/logout/restore` و حالت `loading`


## Module 2 — Clients Management (Coach App)
- Screens:
  - `ClientsListScreen` (جست‌وجو، Paging با cursor، Pull-to-Refresh، افزودن مشتری)
  - `ClientProfileScreen` (نمای کلی، یادداشت‌ها، برنامه‌ها؛ بایگانی)
  - `AddClientScreen` (فرم ساده و اعتبارسنجی)
- GraphQL:
  - `CLIENTS_LIST`, `CLIENT_BY_ID`, `UPSERT_CLIENT`, `ADD_NOTE`, `ARCHIVE_CLIENT`, `CLIENT_NOTES`
- Navigation:
  - Tab `Clients` شامل Stack (List → Profile → Add)
- UX:
  - خالی/خطا/Loading، بَدج وضعیت، تاریخ‌ها و متریک‌های کلیدی
- توسعه‌های بعدی (اختیاری):
  - Chat/DM، رزرو جلسات، اتصال Plan Builder، Metrics charts، فایل‌های اشتراکی.


## Module 3 — Plan Builder (Coach App)
- Screens:
  - `PlanListScreen`: جست‌وجو/Paging، ساخت برنامه، عملیات «انتشار/کپی»
  - `PlanEditorScreen`: عنوان/توضیح، روزها (DayEditor)، آیتم‌ها (ExerciseRow/SetEditor)، ذخیره/انتشار و اختصاص به مشتری
  - `ExerciseLibraryScreen`: جست‌وجوی حرکات و انتخاب برای افزودن به روز
  - `AssignPlanScreen`: اختصاص برنامه به مشتری با تاریخ شروع
- GraphQL:
  - `PLANS_LIST`, `PLAN_BY_ID`, `UPSERT_PLAN`, `DUPLICATE_PLAN`, `PUBLISH_PLAN`, `ASSIGN_PLAN`, `EXERCISE_LIBRARY`
- Navigation:
  - تب جدید **Plans** با یک Stack داخلی.
- توسعه‌های پیشنهادی بعدی:
  - نسخه‌بندی پیشرفته (compare/diff)، تمپلیت‌ها، bulk edit ست‌ها، تقویم برنامه، درگ-اند-دراپ چینش آیتم‌ها/روزها.


## Plan Blocks & Protocols
- در ادیتور برنامه، بلوک‌ها (تکی/سوپرست/تری‌ست/سیرکیت) + پروتکل‌های 5x5, GVT, EMOM, HIIT با پارامترهای قابل ویرایش.
- یادداشت روزانه و دکمهٔ ضبط ویس آزمایشی (جهت اتصال به `uploadVoice`).

## WebView Anatomy 3D
- صفحهٔ `Anatomy3DWebView` برای بارگذاری نسخهٔ وب سه‌بعدی. در تولید، URL رسمی vitrin-site را جایگزین کنید.


### My Library (Coach)
- `MyLibraryUploadScreen`: آپلود ویدئو با presigned URL (S3)، سپس ثبت به‌عنوان ویدئوی خصوصی (ownerId).
- PlanEditor اکنون ویس روزانه را آپلود و به `voiceUrl` متصل می‌کند.


### MyLibraryUpload — انتخاب دسته‌بندی
- بارگذاری ویدئو با presigned URL + انتخاب رشته/تجهیز/عضلات اصلی و فرعی از GraphQL.


### Exercise Library — Thumbnail & Duration
- حالا در لیست حرکات، تصویر پیش‌نمایش و مدت‌زمان نمایش داده می‌شود (بعد از اجرای `processExerciseMedia`).

### Anatomy ↔︎ Library Bridge
- در `Anatomy3DWebView`، پیام انتخاب عضله دریافت و به `ExerciseLibrary` با فیلتر همان عضله هدایت می‌شود.

### Plan Blocks — بخش‌ها
- برای هر بلوک می‌توان بخش را تعیین کرد: گرم‌کردن / تمرین اصلی / سردکردن.


### Template Wizard
- `TemplateWizardScreen` سه تمپلیت استاندارد می‌سازد و باز به PlanEditor هدایت می‌کند.


### Protocol Timers
- `ProtocolTimer` (EMOM/HIIT) با Haptics. در PlanEditor، اگر بلوکی با این پروتکل‌ها باشد، تایمر نمایش داده می‌شود.


### Upload Progress
- `MyLibraryUploadScreen` حالا از `FileSystem.createUploadTask` برای PUT استفاده می‌کند و درصد پیشرفت را نمایش می‌دهد.
- اگر فایل بزرگ باشد، توصیه می‌شود به Multipart (GraphQL موجود در content-service) ارتقا دهید.


### Large Video Uploads
- اگر اندازهٔ فایل >45MB باشد، مسیر Multipart (اسکلت) فعال می‌شود؛ در محیط تولید از ماژول نیتیو برای برش فایل استفاده کنید.


### Exercise Player
- صفحهٔ `ExercisePlayerScreen` برای پخش ویدئو، ثبت View و Like.
### Library Filters
- کامپوننت `ExerciseFilters` با جستجو، چندانتخابی عضلات/رشته‌ها و سطح/نوع.


### Plan Block Editor (پیشرفته)
- انتخاب نوع بلوک: SINGLE | SUPERSET | TR ISET | CIRCUIT
- فیلدهای rounds و restBetweenItemsSec
- دکمه‌های Apply Protocol: 5x5, GVT, EMOM, HIIT
- (PlanEditor باید این patchها را به سرور با `updateBlockMeta`/`applyProtocol` بفرستد — اسکلت گراف‌QL مهیاست.)


### PlanEditor — اتصال آنلاین
- تغییرات BlockEditor فوراً به سرور ارسال می‌شود: `updateBlockMeta`، `applyProtocol`، `reorderPlanBlocks`، `duplicateBlock`.
- جابه‌جایی با ↑/↓ روی سرور هم همگام می‌شود.


### Session Note (App)
- `SessionNoteScreen` با ضبط صوت (Expo Audio) و ثبت متن؛ آپلود به S3 با `requestUploadUrl`.


### Auth (Dev scaffolding)
- `auth/AuthProvider.tsx` + `screens/LoginScreen.tsx` + `CoachOnboardingScreen.tsx`
- برای پروداکشن، به auth-service (OTP/OAuth/JWT) متصل کنید و Navigator را محافظت کنید.


### QuickBlockScreen
- جستجوی حرکت، انتخاب چندتایی، و ساخت بلوک پیچیده روی یک روز برنامه (استفاده از `createComplexBlock`).



| Script | Command |
|---|---|
| `android` | `expo start --android` |
| `build` | `tsc -p tsconfig.json` |
| `clean` | `rimraf dist || true` |
| `codegen` | `graphql-codegen` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `nodemon --watch src --exec ts-node src/main.ts` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `ios` | `expo start --ios` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx` |
| `prepare` | `husky install || true` |
| `prisma:generate` | `prisma generate` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:studio` | `prisma studio` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `expo start` |
| `start:prod` | `node dist/main.js` |
| `test` | `jest --passWithNoTests` |
| `test:cov` | `jest --coverage` |
| `test:e2e` | `echo "e2e placeholder"` |
| `typecheck` | `tsc -p tsconfig.json --noEmit || echo 'no tsconfig'` |
| `web` | `expo start --web` |

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
