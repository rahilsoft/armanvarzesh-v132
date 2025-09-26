

## Tiles (Prisma) — Production Notes
- Run migrations: `pnpm prisma generate && pnpm prisma migrate dev --name init_tiles`
- GraphQL:
  - Query: `tiles(page)` returns current tiles with fields incl. variant/weight.
  - Mutations:
    - `upsertTile(input:{ page, type, variant?, weight?, data(JSON), actorId })` (roles: admin/editor)
    - `publishTile(tileId, actorId)` (roles: admin)
- RBAC:
  - Configure `AUTH_JWKS_URL` or `ADMIN_JWT_PUBLIC_KEY` (PEM string) and optionally `AUTH_ISSUER`/`AUTH_AUDIENCE`.
  - Roles expected in JWT: `roles` array or space-separated `scope`.
- Uploads:
  - `getSignedUpload(contentType, ext?)` uses S3 presigned URL (expires 15 min). Configure S3 envs.


## Preview Drafts
- Query `tiles(page, includeDraft)` returns DRAFT + PUBLISHED when `includeDraft=true`.
- Secure preview by checking a header (e.g., `X-Preview-Token`) in a custom guard/middleware against `PREVIEW_TOKEN` env.


## Preview Security
- Set `PREVIEW_TOKEN` and send `X-Preview-Token` header to allow `includeDraft=true` in tiles query.
- Alternatively, authenticated users with proper roles (via RolesGuard) can access drafts.


## Signed Preview Links
- Set `PREVIEW_SIGNING_KEY` (random secret).
- Generate token: `generatePreviewToken(page:"home", ttlSec:900)` (roles: admin/editor).
- Frontend passes token via `?preview=<token>` → header `X-Preview-Token` sent automatically (see vitrin-site).


## Media Pipeline (sharp)
- Query: `makeImageVariants(url:String!, maxWidth?:Int)` → `{ blurDataURL, variants[] }`
- در حالت DEV فقط blurDataURL تولید می‌شود. برای تولید و آپلود ورژن‌ها به S3 می‌توانیم در گام بعد S3 Put را اضافه کنیم.


## Image Variants (AVIF/WebP + blur)
- Query: `makeImageVariantsFull(url, widths?, bucketPrefix?)` → `{ files[{url,format,width}], blurDataURL }`
- اگر `S3_BUCKET` و اعتبارنامه‌ها ست شوند، نسخه‌ها در S3 آپلود و URL عمومی برگردانده می‌شود.
- برای CDN، `PUBLIC_MEDIA_BASE` را به مبدأ CDN ست کنید.

## Observability (OpenTelemetry)
- `src/tracing.ts` با OTLP HTTP Exporter. ENV: `OTEL_EXPORTER_OTLP_ENDPOINT`.


## DB Hardening
- Added `logicalId` to `Tile` + indexes: `@@index([page, logicalId, variant, state])`, `@@index([updatedAt])`.
- Audit trail: `PublishAudit` model with actions (UPSERT/PUBLISH/ARCHIVE).

## Rate Limiting & Cache
- Simple token-bucket `RateGuard` (in-memory) available for GraphQL (attach as needed).
- CacheModule + CacheInterceptor applied on read queries (TTL ~30s).
- CORS with allowlist via `CORS_ORIGINS` env; Helmet enabled.

## Health
- `GET /healthz` & `GET /ready`


## Audit GraphQL
- Query: `auditLogs(tileId?, page?, limit?, cursor?)` → لاگ‌های PublishAudit با snapshot JSON برای Diff سمت کلاینت.

## S3 Cache-Control
- نسخه‌ها با `CacheControl: public, max-age=31536000, immutable` آپلود می‌شوند (قابل‌تخصیص با fork).


## Feature Flags (GraphQL)
- Query: `featureFlags` → لیست فلگ‌های ادغام‌شده از ENV `FEATURE_FLAGS_JSON` و DB.
- Mutation: `setFeatureFlag(key,value,actorId?,description?)` (roles: admin/editor).



## Plan Builder v2 — GraphQL
- **Exercises**: `exercises(search, muscle, equipment, cursor, limit, ownerId)`; `upsertExercise(input)`, `reviewExercise(id,status)`
- **Upload**: `uploadVoice(data, ext)` → ذخیرهٔ فایل صوتی و برگرداندن URL
- **Plans**: `plan(id)`, `plans(cursor,limit,search)`, `upsertPlan(input)`, `publishPlan(id)`, `duplicatePlan(id)`
- **Assign**: `assignPlan(planId, clientId, startDate, sessionsPerWeek, restDays, durationDays)` → ایجاد جلسات برنامه
- Prisma models: `ExerciseVideo` (با وضعیت تأیید)، `Plan/PlanDay/PlanBlock/PlanBlockItem/PlanSet`, `PlanAssignment/PlanSession`


### S3 Upload (اختیاری، توصیه‌شده)
- متغیّرها: `AWS_REGION`, `S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Mutation: `requestUploadUrl(kind, ext)` → `{ uploadUrl, fileUrl }` (در فیلد `url` به‌صورت JSON برمی‌گردد)
- برای وُیس همچنان `uploadVoice(base64)` به‌عنوان fallback محلی فعال است.


### Sessions & Reassign
- `sessionsByClient(clientId, from, to)` → لیست جلسات برای بازهٔ تاریخی
- `reassignPlanDates(assignmentId, startDate, sessionsPerWeek, restDays[], durationDays)` → بازتولید جلسات


### Media Processing
- `processExerciseMedia(id)` → محاسبهٔ `durationSec` با ffprobe و ساخت `thumbnailUrl` (لوکال یا S3).
- مدل `ExerciseVideo` الان `thumbnailUrl` و `durationSec` دارد.


### Media Worker (BullMQ)
- Env: `REDIS_URL` برای فعال‌سازی صف. اگر خالی باشد، پردازش به‌صورت inline اجرا می‌شود.
- `enqueueMediaProcessing(exerciseId)` در upsertExercise فراخوانی می‌شود.
- `processExerciseMediaHandler(id)` منطق FFmpeg/ffprobe را انجام می‌دهد.


### AnatomyConfig
- مدل: `AnatomyConfig` با فیلدهای `gender`, `modelUrl`, `meshMap(JSON)`، `active`.
- Query: `anatomyConfig(gender)`؛ Mutation: `upsertAnatomyConfig(input)`.

### Multipart Upload (S3)
- `createMultipartUpload(kind, ext)` → `{ uploadId, key }`
- `signUploadPart(key, uploadId, partNumber)` → URL برای هر part
- `completeMultipartUpload(key, uploadId, parts(JSON))` → `{ url }`


### Sessions — Execution & Logs
- مدل‌ها: `PlanSession.status/completedAt`, `PlanSet.targetWeight/targetRPE`, `PlanSetLog`.
- Query: `sessionDetail(id)` — جزئیات جلسه + بلوک‌ها/آیتم‌ها/ست‌ها.
- Mutations: `startSession`, `completeSession`, `logSet(sessionId, planSetId, reps, weight?, rpe?, note?)`.
- Auto-progression: `autoProgressAssignment(assignmentId, mode?)` — ساده: وزن +2.5 کیلو یا افزایش تکرار تا سقف 12.



### Exercise Search & Popularity
- Query: `searchExercises(input)` با فیلترهای search/muscles/equipment/sports/level/kind/duration و sortBy (RECENT|POPULAR|DURATION)
- Mutations: `exerciseView(id)`, `exerciseLike(id, delta?)`
- مدل `ExerciseVideo` شامل `viewCount/likeCount`

### Plan Ops — Reorder/Duplicate
- `reorderPlanBlocks(dayId, orderedIds[])`, `reorderPlanItems(blockId, orderedIds[])`
- `duplicateBlock(blockId)`, `duplicateDay(dayId)`


### Security (سبک)
- هدرهای `x-role` و `x-user-id` در GraphQL برای تشخیص نقش/کاربر. با `SKIP_AUTH=1` از گارد عبور می‌کند.
- Mutation `approveExercise(id, status?)` فقط برای `admin` مجاز است.


### Advanced Plan APIs
- `updateBlockMeta(blockId, section?, type?, rounds?, restBetweenItemsSec?)`
- `applyProtocol(blockId, protocol, paramsJSON?)` — پیکربندی خودکار ست‌ها/پارامترها برای 5x5, GVT, EMOM, HIIT
- `validatePlan(planId)` — بررسی ناسازگاری‌ها (Superset/Triset/Circuit/EMOM/HIIT)
- `simulateSession(sessionId)` — برآورد زمان اجرای جلسه (ثانیه) در سطح بلوک و کل


### Session Notes & Audio
- Model: `PlanSessionNote(sessionId, role, text?, audioUrl?, authorId?, createdAt)`
- Queries: `sessionNotes(sessionId)`
- Mutations: `upsertSessionNote(input)`
- Upload: `requestUploadUrl(kind, ext)` → JSON `{ uploadUrl, fileUrl }` (S3 presigned یا fallback)

### Scheduling (Month)
- `generatePlanSchedule(assignmentId, startDate, sessionsPerWeek, restDaysJSON?)` → ساخت خودکار جلسات ~۴ هفته با احترام به روزهای استراحت.


### Analytics (GraphQL)
- `userAdherence(clientId, from, to)` — نرخ تکمیل جلسات
- `topExercises(limit?)` — محبوب‌ترین تمرین‌ها (❤/👁)
- `trainingLoadByWeek(clientId, weeks?)` — بار تمرینی (Σ reps × weight) به تفکیک هفته

### Security (Dev)
- هدرهای `x-role` / `x-user-id` با `SKIP_AUTH=1` برای توسعه؛ در پروداکشن از Gateway/JWT استفاده کنید.



| Script | Command |
|---|---|
| `build` | `tsc -p tsconfig.build.json` |
| `clean` | `rimraf dist || true` |
| `coverage` | `jest --coverage --passWithNoTests` |
| `dev` | `ts-node src/main.ts` |
| `format` | `prettier --write .` |
| `format:check` | `prettier -c . || echo "no prettier"` |
| `lint` | `pnpm -w exec eslint . --ext .ts,.tsx || echo "no eslint"` |
| `prepare` | `husky install || true` |
| `prisma:db:push` | `prisma db push --schema prisma/schema.prisma` |
| `prisma:generate` | `prisma generate --schema prisma/schema.prisma` |
| `prisma:migrate` | `prisma migrate deploy` |
| `prisma:migrate:deploy` | `prisma migrate deploy --schema prisma/schema.prisma` |
| `prisma:migrate:dev` | `prisma migrate dev --name init --schema prisma/schema.prisma` |
| `prisma:studio` | `prisma studio` |
| `sbom` | `npx @cyclonedx/cyclonedx-npm --ignore-npm-errors --json --output-file sbom.json` |
| `start` | `node dist/main.js` |
| `start:dev` | `nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts || nest start --watch` |
| `start:prod` | `node dist/main.js` |
| `test` | `jest --passWithNoTests || vitest run || echo "no tests"` |
| `test:cov` | `jest --coverage --runInBand` |
| `test:e2e` | `jest --config ./test/jest-e2e.json` |
| `typecheck` | `tsc -p tsconfig.build.json --noEmit` |

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
