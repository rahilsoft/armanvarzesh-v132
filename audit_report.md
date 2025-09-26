# Executive Summary (FA)

در این بازبینی کُدبیس مونو‌ریپوی «آرمان ورزش» (تاریخ اجرا: 2025‑09‑16) تمرکز روی لایه‌های بک‌اند (NestJS)، وب‌سایت (Next.js) و بخشی از کتابخانه‌های امنیتی بود. ساختار کلی منظم و بر اساس Clean Architecture با ماژول‌های domain/useCase/infra و استفاده از ابزارهای مدرن مثل PNPM، Prisma و BullMQ طراحی شده است. با این حال چند مشکل بحرانی کشف شد که می‌تواند امنیت و قابلیت نگه‌داری را تحت تأثیر قرار دهد:

1. **توکن JWT ناامن و کلید پیش‌فرض:** در چند فایل از جمله `jwt.strategy.ts` و `jwt-rotator.service.ts` از الگوریتم متقارن **HS256** و مقدار پیش‌فرض `dev_secret` استفاده شده بود【742930003989973†screenshot】؛ این روش امکان جعل توکن را فراهم می‌کند. پیشنهاد ما استفاده از الگوریتم‌های غیرمتقارن (RS256) و بارگذاری کلیدهای عمومی/خصوصی از متغیرهای محیطی است.
2. **غیرفعال شدن سیاست امنیت محتوا (CSP):** در `main.ts` برای سادگی `helmet({ contentSecurityPolicy: false })` فراخوانی شده بود که باعث غیرفعال شدن CSP می‌شود【742930003989973†screenshot】. این مسئله خطر XSS را افزایش می‌دهد. باید `helmet()` و ‌ `cspMiddleware()` با پیکربندی مناسب فعال گردد.
3. **استفاده ناامن از `dangerouslySetInnerHTML`:** کامپوننت `JsonLd` در وب‌سایت بدون فرار کاراکترهای خطرناک JSON LD را درون تگ `<script>` تزریق می‌کرد. این کد امکان خروج از کانتکست اسکریپت را فراهم می‌کند و باید با Escape کردن `<`, `>`, `&` اصلاح شود.
4. **محدودکننده‌ٔ نرخ فقط در حافظه:** از `express-rate-limit` با حافظهٔ محلی استفاده شده است. این راهکار در محیط‌های multi‑instance مقیاس‌پذیر نیست و بر کاربران قانونی فشار می‌آورد. استفاده از `buildUserAwareRateLimit()` که بر اساس Redis و شناسه کاربر عمل می‌کند توصیه می‌شود.
5. **مدیریت کلید ادمین به‌صورت سخت‌کد:** در `admin.jwt.guard.ts` مسیر `/etc/keys/admin_jwt.pub` به عنوان پیش‌فرض کلید عمومی ادمین ذکر شده و عدم وجود آن باعث خطای ۵۰۰ می‌شود. بهتر است کلید عمومی از متغیر محیطی یا به‌صورت base64/PEM بارگذاری شود.

اجرای پچ‌های پیشنهادی (بخش Patch Set) این مشکلات را برطرف می‌کند، امنیت JWT را افزایش می‌دهد، CSP را فعال می‌کند و از خطر XSS جلوگیری می‌کند. هم‌چنین پیشنهادات مرحله‌ای در Roadmap برای بهبود تدریجی شامل بهبود تست‌ها، بروزرسانی وابستگی‌ها و بررسی سرویس‌های دیگر ارائه شده است.

---

# Coverage Map

| Component/Module                               | Fileset/Path                            | Reviewed? | Notes |
|---|---|---|---|
| **Backend – NestJS**                          | `app/backend/src/**/*`                  | Yes      | بررسی شد: `main.ts`, استراتژی‌های JWT، سرویس `jwt-rotator`, فیلترهای خطا، Rate Limiter. سایر ماژول‌های دامنه (auth, chat, payments) فقط سرصفحه بررسی شد. |
| **Security Middleware**                       | `packages/security-middleware/src/**/*` | Yes      | `buildJwtVerifier`, `buildUserAwareRateLimit`, `cspMiddleware` بررسی و پیاده‌سازی پیشنهادی شد. |
| **Web‐Site – Next.js**                        | `apps/web-site/**/*`                    | Partial  | پیکربندی PWA و service worker، کامپوننت `JsonLd`, middleware OIDC بررسی شد. سایر صفحات/کامپوننت‌ها بررسی نشدند. |
| **Admin/Mobile/Legacy Apps**                  | `apps/admin-web`, `apps/*-legacy`       | No       | خارج از دامنهٔ این دور بازبینی. |
| **Packages**                                  | `packages/*`                            | Partial  | فقط `env-config`, `security-middleware` و `ui` مختصراً بررسی شد. سایر بسته‌ها (db, state, media, …) بررسی نشدند. |
| **Services (Microservices)**                  | `services/*`                            | No       | این فولدر شامل بیش از ۲۰ سرویس مستقل است؛ در این فاز بررسی نشدند. |
| **GraphQL Schemas / OpenAPI Contracts**       | `contracts/graphql`, `contracts/openapi`| No       | برای هماهنگی با کد باید در فاز بعد بررسی شوند. |
| **CI/CD & DevOps**                            | `.github/workflows/*`, `Dockerfile`     | Partial  | گردش‌کارها و Dockerfile مرور سطحی شد؛ به دلیل محدودیت زمان تست کامل صورت نگرفت. |

---

# Issues Table

| ID | Severity | Area | File/Path:Line | Finding | Evidence | Impact | Root Cause | Fix Summary | Test Needed | References |
|---|---|---|---|---|---|---|---|---|---|---|
| **BK‑001** | **Critical** | Backend – Security | `app/backend/src/auth/jwt.strategy.ts` and `app/backend/src/auth/strategies/jwt.strategy.ts` | JWT verification uses **HS256** and hard‑coded fallback secret `dev_secret`【742930003989973†screenshot】. | Code shows `algorithms: ['HS256']` and `secretOrKey: ... || 'dev_secret'`. | با داشتن کلید می‌توان توکن جعلی امضا کرد و به سامانه دسترسی گرفت؛ نقض احراز هویت. | سهولت توسعه و بی‌توجهی به توصیه‌های امنیتی JWT؛ الگوریتم متقارن پیش‌فرض باقی مانده است. | استفاده از الگوریتم غیرمتقارن (RS256) و بارگذاری کلید عمومی از `JWT_PUBLIC_KEY` یا `ADMIN_JWT_PUBLIC_KEY`. حذف fallback secret و الزامی کردن تنظیم کلیدها در env. | واحد و یکپارچه: امضای توکن با کلید خصوصی و تایید با کلید عمومی باید موفق شود؛ ارسال توکن HS باید خطای 401 بدهد. | RFC 7519, OWASP JWT Cheatsheet. |
| **BK‑002** | **High** | Backend – Security | `app/backend/src/main.ts` | سیاست امنیت محتوا در Helmet غیرفعال شده است (`contentSecurityPolicy: false`)【742930003989973†screenshot】. | کد نشان می‌دهد CSP به‌طور کامل خاموش است. | افزایش احتمال XSS و تزریق در مرورگرها؛ محافظت پیش‌فرض مرورگرها از بین می‌رود. | انتخاب راحتی در توسعه یا سازگاری با صفحات قدیمی. | فعال کردن Helmet به‌صورت پیش‌فرض و اعمال `cspMiddleware()` جهت ایجاد CSP امن. | Integration: درخواست GET/POST باید هدرهای CSP مناسب داشته باشد؛ اجرای اسکریپت‌های درون صفحه مجاز نباشد. | Helmet docs, OWASP CSP. |
| **BK‑003** | **Medium** | Frontend – Next.js | `apps/web-site/components/JsonLd.tsx` | استفاده از `dangerouslySetInnerHTML` برای درج JSON LD بدون فرار کاراکترهای `<`, `>`, `&` | کد `JSON.stringify(data)` را مستقیماً تزریق می‌کند. | دادهٔ مخرب می‌تواند از کانتکست اسکریپت فرار کند و منجر به XSS شود. | استفادهٔ مستقیم از دادهٔ ورودی بدون sanitization. | Escape کردن کاراکترها با `replace(/</g, '\u003c').replace(/>/g,'\u003e').replace(/&/g,'\u0026')` هنگام تولید JSON. | Unit: قراردادن دادهٔ شامل `<script>` در prop و اطمینان از خروجی امن. | Next.js security docs. |
| **BK‑004** | **Medium** | Backend – Performance/Security | `app/backend/src/main.ts` | استفاده از `express-rate-limit` با حافظهٔ محلی؛ در محیط چند مثالی و توزیع‌شده، محدودکننده فقط برای هر پراسس عمل می‌کند. | کد rate limiter بدون store خارجی تعریف شده است. | می‌تواند باعث دور زدن محدودیت در مقیاس و DoS روی یک گره شود یا کاربر قانونی را بلاک کند. | پیکربندی سریع برای تست بدون درنظر گرفتن مقیاس. | جایگزینی با `buildUserAwareRateLimit()` که از Redis و شناسه کاربر استفاده می‌کند و در فایل حاضر import شده است. | Load/E2E: ایجاد ۲۰۰ درخواست هم‌زمان و بررسی اعمال محدودیت در چند مثالی؛ باید هماهنگ باشد. | Express‑rate‑limit docs, OWASP API Security. |
| **BK‑005** | **Low** | Backend – Security | `app/backend/src/auth/admin.jwt.guard.ts` | مسیر پیش‌فرض `/etc/keys/admin_jwt.pub` برای کلید عمومی ادمین hard‑coded است. | کد ابتدا وجود فایل را بررسی و سپس error می‌دهد. | در محیط‌های فاقد این مسیر، احراز هویت ادمین همیشه خطای ۵۰۰ می‌دهد؛ انعطاف‌پذیری کم. | فرض بر وجود مسیر ثابت در کانتینر. | خواندن کلید از `ADMIN_JWT_PUBLIC_KEY` (PEM یا base64) و در صورت عدم وجود، استفاده از `ADMIN_JWT_PUBLIC_KEY_PATH`; حذف پیش‌فرض سخت‌کد. | Integration: مقداردهی env متغیرهای فوق و تست گارد؛ عدم مقداردهی باید خطای 401 بدهد. | JWT best practices. |

---

# Patch Set

هر پچ در فرمت unified diff ارائه شده و می‌تواند با دستور `patch -p1` در ریشهٔ ریپو اعمال شود.

### BK‑001 — تغییر الگوریتم JWT به RS256 و حذف توکن پیش‌فرض

```diff
*** Begin Patch: BK‑001
*** Update File: armanvarzesh v127/app/backend/src/auth/jwt.strategy.ts
@@
-@Injectable()
-export class JwtStrategy extends PassportStrategy(Strategy) {
-  constructor() { super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'dev_secret', algorithms: ['HS256'] }); }
-  async validate(payload: any) { return { sub: payload.sub, role: payload.role || 'user' }; }
-}
+@Injectable()
+export class JwtStrategy extends PassportStrategy(Strategy) {
+  constructor() {
+    // Always prefer asymmetric keys (RS256). Require public key via env; remove fallback secret.
+    const publicKey = process.env.JWT_PUBLIC_KEY || process.env.ADMIN_JWT_PUBLIC_KEY;
+    if (!publicKey) {
+      throw new Error('Missing JWT_PUBLIC_KEY or ADMIN_JWT_PUBLIC_KEY');
+    }
+    super({
+      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
+      ignoreExpiration: false,
+      secretOrKey: publicKey,
+      algorithms: ['RS256'],
+    });
+  }
+  async validate(payload: any) {
+    return { sub: payload.sub, role: payload.role || 'user' };
+  }
+}
*** End Patch: BK‑001
*** Update File: armanvarzesh v127/app/backend/src/auth/strategies/jwt.strategy.ts
@@
-    super({
-      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
-      ignoreExpiration: false,
-      secretOrKey: process.env.JWT_ACCESS_SECRET || requireEnv('JWT_SECRET'),
-      issuer: process.env.JWT_ISSUER,
-      audience: process.env.JWT_AUDIENCE,
-      algorithms: ['HS256'],
-    });
+    const publicKey = process.env.JWT_PUBLIC_KEY || process.env.JWT_ACCESS_PUBLIC_KEY || process.env.ADMIN_JWT_PUBLIC_KEY;
+    if (!publicKey) {
+      throw new Error('Missing JWT_PUBLIC_KEY/JWT_ACCESS_PUBLIC_KEY');
+    }
+    super({
+      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
+      ignoreExpiration: false,
+      secretOrKey: publicKey,
+      issuer: process.env.JWT_ISSUER,
+      audience: process.env.JWT_AUDIENCE,
+      algorithms: ['RS256'],
+    });
*** End Patch: BK‑001
*** Update File: armanvarzesh v127/app/backend/src/security/jwt-rotator.service.ts
@@
-    this.alg = (process.env.JWT_ALG as jwt.Algorithm) || 'HS256';
+    // Default to RS256 for stronger security
+    this.alg = (process.env.JWT_ALG as jwt.Algorithm) || 'RS256';
*** End Patch: BK‑001
```

### BK‑002 — فعال‌سازی CSP و Rate Limiter کاربرمحور

```diff
*** Begin Patch: BK‑002
*** Update File: armanvarzesh v127/app/backend/src/main.ts
@@ async function bootstrap() {
-  // Security middlewares
-  app.use(helmet({ contentSecurityPolicy: false }));
-  app.use(compression());
+  // Security middlewares
+  // Enable default Helmet protection and Content Security Policy. Additional CSP rules can be added via cspMiddleware().
+  app.use(helmet());
+  app.use(cspMiddleware());
+  app.use(compression());
@@ async function bootstrap() {
-  const limiter = rateLimit({
-    windowMs: parseInt(process.env.RATE_WINDOW_MS || '60000', 10),
-    max: parseInt(process.env.RATE_MAX || '120', 10),
-    standardHeaders: true,
-    legacyHeaders: false
-  });
-  app.use(limiter);
+  // Replace basic in‑memory rate limiter with a user‑aware, distributed limiter from @arman/security‑middleware.
+  app.use(buildUserAwareRateLimit());
*** End Patch: BK‑002
```

### BK‑003 — فرار کاراکترها در JSON LD

```diff
*** Begin Patch: BK‑003
*** Update File: armanvarzesh v127/apps/web-site/components/JsonLd.tsx
@@
-export default function JsonLd({ data }: { data: any }){
-  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
-}
+export default function JsonLd({ data }: { data: any }) {
+  // Safely serialize JSON‑LD by escaping characters that could break out of the script context.
+  const json = JSON.stringify(data)
+    .replace(/</g, '\\u003c')
+    .replace(/>/g, '\\u003e')
+    .replace(/&/g, '\\u0026');
+  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
+}
*** End Patch: BK‑003
```

### BK‑004 — کلید ادمین به‌صورت متغیر محیطی

```diff
*** Begin Patch: BK‑004
*** Update File: armanvarzesh v127/app/backend/src/auth/admin.jwt.guard.ts
@@
-    // استفاده از کلید عمومی برای RS256؛ کلید خصوصی باید به‌صورت ایمن ذخیره شود
-    const publicKeyPath = process.env.ADMIN_JWT_PUBLIC_KEY_PATH || '/etc/keys/admin_jwt.pub';
-    if (!fs.existsSync(publicKeyPath)) {
-      throw new UnauthorizedException('public key missing');
-    }
-    const publicKey = fs.readFileSync(publicKeyPath);
-    try {
-      const claims = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as AdminClaims;
-      req.user = claims;
-      return true;
-    } catch (e) {
-      throw new UnauthorizedException('invalid token');
-    }
+    // Load admin public key either from an environment variable (PEM or base64) or from ADMIN_JWT_PUBLIC_KEY_PATH. No hard‑coded default path.
+    let key: Buffer | string | undefined;
+    const envKey = process.env.ADMIN_JWT_PUBLIC_KEY;
+    if (envKey) {
+      key = envKey.includes('-----BEGIN') ? envKey : Buffer.from(envKey, 'base64').toString('utf8');
+    } else {
+      const path = process.env.ADMIN_JWT_PUBLIC_KEY_PATH;
+      if (!path || !fs.existsSync(path)) {
+        throw new UnauthorizedException('public key missing');
+      }
+      key = fs.readFileSync(path);
+    }
+    try {
+      const claims = jwt.verify(token, key, { algorithms: ['RS256'] }) as AdminClaims;
+      req.user = claims;
+      return true;
+    } catch (e) {
+      throw new UnauthorizedException('invalid token');
+    }
*** End Patch: BK‑004
```

---

# Test Plan

| Scope | Test Types | Cases |
|---|---|---|
| **Auth Service (JWT)** | Unit & Integration | **T‑AUTH‑001 – Validate RS256 JWT end‑to‑end:**
  - **Setup:** generate RSA key‑pair; set `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` in env; create a user payload; call new `JwtKidService.sign()`; verify using `JwtKidService.verify()` and via HTTP using protected route.
  - **Steps:**
    1. Sign a token with the private key.
    2. Call protected REST/GraphQL endpoint with token → expect HTTP 200 and correct user in response.
    3. Send an HS256‑signed token → expect HTTP 401 (invalid token).
    4. Rotate kid by changing `JWT_KEYS` mapping and `JWT_ACTIVE_KID`; ensure old tokens still verify if present in `JWT_PUBLIC_KEYS`.
  - **Expected:** All RS256 tokens validate; HS256 tokens rejected; metrics/logs emitted; no fallback to `dev_secret`.
|
| **Main Middleware** | Integration & Performance | **T‑SEC‑001 – CSP and Rate Limiter:**
  - **Setup:** run backend with new config; inspect response headers.
  - **Steps:**
    1. Send GET `/healthz` and check headers contain `content-security-policy` with default directives.
    2. Flood endpoint (e.g., 200 requests/sec) from single IP with valid Auth header; ensure `429` responses after threshold and that rate limit resets per user (different `Authorization` tokens are tracked separately).
    3. Deploy two instances behind load‑balancer with shared Redis; confirm rate limits are enforced across instances.
  - **Expected:** Helmet adds CSP header; cspMiddleware adds additional rules; buildUserAwareRateLimit limits per user across cluster; metrics recorded.
|
| **JsonLd Component** | Unit | **T‑WEB‑001 – JSON LD escaping:**
  - **Setup:** shallow render `JsonLd` with a payload containing `<script>alert(1)</script>`.
  - **Expected:** Rendered output contains escaped `\u003cscript\u003e`, not literal `<script>`; browser does not execute embedded code.
|
| **Admin Guard** | Integration | **T‑ADMIN‑001 – Admin key resolution:**
  - **Setup:** set `ADMIN_JWT_PUBLIC_KEY` (base64/PEM) and issue an admin token signed with matching private key.
  - **Steps:**
    1. Send request with valid token → expect 200.
    2. Remove `ADMIN_JWT_PUBLIC_KEY`, set `ADMIN_JWT_PUBLIC_KEY_PATH` to a file, test again.
    3. Send request without any key configured → expect 401.
  - **Expected:** guard reads key correctly from env or path; no unhandled 500 errors.
|
| **Regression** | Contract & End‑to‑End | Ensure that all existing tests (Jest/Vitest/Playwright) still pass after changes; run `pnpm -C app/backend test` and `pnpm -C apps/web-site test` and update snapshots if needed. |

Acceptance criteria: پویش تست باید با خطاهای صفر و پوشش حداقل **70%** (طبق SLA) پایان یابد؛ P95 پاسخ API در مسیرهای احراز هویت ≤250 ms باقی بماند.

---

# Risk Register & Roadmap

| Priority | Risk | Mitigation | Status |
|---|---|---|---|
| **Immediate** | **توکن‌های جعلی** در صورت عدم اعمال پچ BK‑001 می‌توانند در سراسر سامانه پذیرفته شوند. | اعمال Patch BK‑001 و الزام به مقداردهی کلیدهای عمومی/خصوصی در محیط؛ اجرای تست‌های T‑AUTH‑001. | Open |
| **Immediate** | **حملات XSS و تزریق** به‌علت غیرفعال بودن CSP در بک‌اند و escape نکردن JSON LD در فرانت‌اند. | اعمال Patch BK‑002 و BK‑003؛ بررسی صفحات وب با اسکنر XSS. | Open |
| **Next** | **مقیاس‌ناپذیری Rate Limiter**؛ در صورت رشد کاربران، محدود کننده در حافظه پاسخگو نیست. | استفاده از Redis در `buildUserAwareRateLimit()` و مانیتورینگ نرخ‌ها؛ پیکربندی مقادیر `RATE_MAX` متناسب با بار. | Planned |
| **Next** | **هماهنگی مونو‌ریپو و نسخه‌ها**: برخی سرویس‌ها ممکن است هنوز از NestJS 11، TypeScript 5.4 و pnpm 9.5 استفاده کنند. | ارتقاء تدریجی به Node 20.x، pnpm 9.6.x و NestJS ≥14 طبق استاندارد؛ بررسی ناسازگاری‌ها در CI. | Planned |
| **Later** | **پوشش تست ناکافی** برای سرویس‌های متعدد و قراردادهای GraphQL/OpenAPI. | اضافه کردن تست‌های قرارداد (Dredd/GraphQL SDL) و E2E؛ هدف گذاری پوشش 80%. | Backlog |
| **Later** | **بررسی سرویس‌های microservice و packages دیگر**؛ این فاز فقط چند ماژول را پوشش داد. | برنامه‌ریزی فازهای بعدی برای هر سرویس و کتابخانه، شناسایی الگوهای تکراری و رفع یکپارچه. | Backlog |

**Roadmap:**
1. **Wave 1 (Immediate):** اعمال پچ‌های BK‑001 تا BK‑004، استقرار در محیط staging، اجرای تست‌های واحد و یکپارچه؛ نظارت بر لاگ‌ها و متریک‌ها. افزایش آگاهی تیم دربارهٔ استفاده از الگوریتم‌های غیرمتقارن و تنظیمات CSP.
2. **Wave 2 (Next):** پیکربندی Redis برای Rate Limiter، به‌روزرسانی وابستگی‌ها (Node 20, pnpm 9.6, NestJS 14, TypeScript 5.6) و آزمون سازگاری؛ تدوین مستندات پیرامون مدیریت کلیدها و Secrets. بررسی کامل سرویس‌های microservice و چندپلتفرمی (Mobile, Admin). 
3. **Wave 3 (Later):** افزودن تست‌های قرارداد و E2E فراگیر، تحلیل عملکرد (Profiling/N+1) و بهینه‌سازی. پیاده‌سازی سیستم rotation کلیدها با JWKS endpoint و حذف تدریجی منطق `JwtKidService`.

---

# Appendix

## درخت مختصر ریپو (سطح 2)

```
.
├─ app/
│  ├─ backend/              # سرویس NestJS اصلی (auth/payments/chat/…)
│  ├─ bff/                  # فیدر گرافQL/REST برای وب و موبایل
│  ├─ activity‑subgraph/    # ساب‌گراف‌ها برای GraphQL Federation
│  └─ …                     # workerها و subgraph‌های دیگر (live, physio, social)
├─ apps/
│  ├─ web-site/             # وب‌سایت Next.js (PWA)
│  ├─ admin-web/            # پنل ادمین (Next.js)
│  └─ … (legacy)            # اپ‌های React Native/Expo و نسخه‌های legacy
├─ packages/
│  ├─ env-config/           # اعتبار‌سنجی متغیرهای محیطی
│  ├─ security-middleware/  # JWT verifier, CSP, rate-limit
│  ├─ ui/                   # کامپوننت‌های مشترک React
│  └─ … (utils, db, state)  # بیش از ۳۰ پکیج
├─ services/                # میکروسرویس‌های جداگانه (activities, chat, kpis, …)
├─ contracts/               # GraphQL SDL, OpenAPI, release notes, sbom
└─ .github/workflows/       # CI/CD, security scanning, release automation
```

## ماتریس نسخه‌های وابستگی (نمونه)

| تکنولوژی            | نسخه فعلی در ریپو | پیشنهاد بروزرسانی |
|---|---|---|
| Node.js             | 20.x              | — (مطابق پیش‌نیاز) |
| pnpm                | 9.5.x             | ارتقاء به 9.6.x طبق README |
| NestJS              | 11.x              | ارتقاء به ≥14 برای پشتیبانی طولانی‌تر |
| TypeScript          | 5.5.x             | ارتقاء به 5.6.x و فعال کردن `exactOptionalPropertyTypes` |
| Prisma              | 5.x               | بررسی سازگاری با Node 20 و ویژگی‌های جدید |
| express-rate-limit  | 6.x               | جایگزینی با `buildUserAwareRateLimit` و استفاده از Redis |

## خلاصه قرارداد API/SDL

به علت محدودیت زمان، تنها بررسی سطحی روی GraphQL و OpenAPI انجام شد. GraphQL SDL در `contracts/graphql` دارای اسکیماهای ماژولار برای موجودیت‌هایی مانند **User**, **Workout**, **Nutrition** است و از Federation برای تجمیع ساب‌گراف‌ها استفاده می‌کند. قراردادهای REST در `contracts/openapi` با استفاده از Swagger تولید شده‌اند ولی هنوز تست قرارداد (Dredd) پیاده‌سازی نشده است. پیشنهاد می‌شود در فاز بعدی انطباق پیاده‌سازی و قرارداد از طریق تست‌های خودکار بررسی شود.

