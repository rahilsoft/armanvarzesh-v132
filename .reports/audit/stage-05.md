# Stage 05 — Security Audit

**Source of truth:** repository only. This is the highest-severity stage.

---

## Findings

### P0-01 — Authentication bypass via trusted `x-user-id` / `x-role` headers (IDOR + privilege escalation)
**Evidence:**
- `services/courses-service/src/courses.controller.ts:22` —
  `const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);`
- `services/content-service/src/plan/plan.resolver.ts:61-62` — `ctxRole()` / `ctxUser()` fall back to `h['x-role']` and `h['x-user-id']` when no valid Bearer token is present, defaulting role from a client header.
- Same header-trust pattern appears in **30** controller/resolver files (`grep -rl 'x-user-id|x-role'`), incl. `nutrition-service` (hydration/habits/wearables controllers), `affiliate-service`, `challenges-service`, and 8 `content-service` resolvers.
**Why it is a problem:** Any unauthenticated client can set `x-user-id: <victim>` / `x-role: admin` and be treated as that user/role. This is Broken Access Control (OWASP A01), IDOR (CWE-639), and privilege escalation (CWE-269) in one.
**Production impact:** Full account takeover of any user by id; self-promotion to admin; read/write of arbitrary users' data. Catastrophic for millions of users.
**Recommended fix:** Remove all header/query identity fallbacks. Derive identity **only** from a verified JWT. Fail closed on missing/invalid token.
**Effort:** M. **Risk:** Critical. **CWE:** 287, 639, 269. **OWASP:** API1/API5, A01.

### P0-02 — `JWT_SECRET` is optional in every service env schema
**Evidence:** `services/*/src/config/env.validation.ts:2` (17+ services) — `JWT_SECRET: Joi.string().min(16).optional()`. `CORS_ORIGIN: Joi.string().allow('*').default('*')`.
**Why it is a problem:** A service can boot with **no** JWT secret. Combined with fallback secrets below, tokens can be forged or verification skipped.
**Production impact:** Forgeable tokens; unauthenticated access.
**Recommended fix:** Make `JWT_SECRET` `.required()` with `min(32)`; fail boot if absent in production.
**Effort:** S. **Risk:** Critical. **CWE:** 287.

### P0-03 — Hardcoded fallback JWT/cert secrets (`'dev'`, `'change_me'`)
**Evidence:**
- `services/content-service/src/plan/plan.resolver.ts:61-62` — `jwt.verify(t, process.env.JWT_SECRET || 'dev')`.
- `services/certificate-service/src/certificate/certificate.service.ts:12` — `jwt.verify(token, process.env.CERT_SECRET || 'change_me')`.
- `services/certificate-service/src/auth/roles.guard.ts:17` — same `'change_me'` fallback.
**Why it is a problem:** If the env var is unset (allowed per P0-02), verification uses a publicly-known literal secret. An attacker signs their own tokens with `'dev'`/`'change_me'` and is fully authenticated with any role.
**Production impact:** Trivial full authentication forgery for content and certificate services.
**Recommended fix:** Remove all literal fallbacks; require secret; no default.
**Effort:** S. **Risk:** Critical. **CWE:** 798 (hardcoded credentials).

### P0-04 — Payment webhook has NO signature verification
**Evidence:** `services/payments-service/src/payments.controller.ts:15-18` — `@Post('webhook')` accepts `{ provider, eventId, type, payload }` from the request body with no signature header check. `payments.service.ts:36 webhook()` trusts `type === 'payment_succeeded'` and `payload.sessionId` directly, then marks the session `paid`, creates an `order`, and grants a `subscription` + `ENTITLEMENT_GRANTED`.
**Why it is a problem:** Anyone who can reach the endpoint can POST `{type:'payment_succeeded', payload:{sessionId:<any>}}` and receive a paid subscription / entitlement **without paying**. No HMAC, no provider signature (Stripe-style `stripe-signature`), no shared secret.
**Production impact:** Free unlimited entitlements; direct revenue loss and fraud.
**Recommended fix:** Verify PSP signature (HMAC over raw body) before processing; reject unsigned.
**Effort:** M. **Risk:** Critical. **CWE:** 345 (insufficient verification of data authenticity). **OWASP:** API8.

### P1-05 — Command injection surface via `execSync` with interpolated paths (+ SSRF)
**Evidence:** `services/content-service/src/jobs/media.worker.ts:50,57` and `services/content-service/src/plan/plan.resolver.ts:321,328` —
`execSync(\`ffprobe ... ${tmpVideo}\`)` and `execSync(\`ffmpeg -y -ss ${sec} -i ${tmpVideo} -frames:v 1 -q:v 3 ${thumb}\`)`.
Paired SSRF: `media.worker.ts:46` / `plan.resolver.ts:~318` — `const r = await fetch(ex.videoUrl)` where `videoUrl` is read from the DB (`exerciseVideo.videoUrl`) with no host allowlist.
**Why it is a problem:** (a) `execSync` with template-string interpolation is command-injection-prone; `tmpVideo`/`thumb` derive from `id`, and `sec` from parsed file metadata — if any input reaches these unsanitized, shell metacharacters execute. (b) `fetch(videoUrl)` with an attacker-controlled URL is SSRF (CWE-918): can hit internal metadata endpoints (169.254.169.254), internal services, or `file:`-like gateways.
**Production impact:** Potential RCE on the worker; SSRF into the cluster/cloud metadata → credential theft.
**Recommended fix:** Use `execFile`/`spawn` with arg arrays (no shell); validate `videoUrl` against an allowlist of trusted CDN hosts; block private IP ranges.
**Effort:** M. **Risk:** High. **CWE:** 78, 918.

### P1-06 — JWT verification without algorithm pinning (alg-confusion risk)
**Evidence:** `services/certificate-service/src/certificate/certificate.service.ts:12`, `.../auth/roles.guard.ts:17`, `services/content-service/src/plan/plan.resolver.ts:61-62`, `app/backend/src/auth/jwt.guard.ts:32`, `app/backend/src/auth/admin.guard.ts:13` — all call `jwt.verify(token, secret)` **without** an `algorithms:['HS256']` option. (By contrast `app/backend/src/livekit/live.gateway.ts:42` does pin `algorithms:['HS256']` — inconsistent.)
**Why it is a problem:** `jsonwebtoken` without `algorithms` accepts whatever the token header claims. With asymmetric keys in play this enables RS256→HS256 confusion; even symmetric-only, it's defense-in-depth omitted.
**Production impact:** Possible token forgery depending on key material.
**Recommended fix:** Always pass `{ algorithms: ['HS256'] }` (or the intended alg).
**Effort:** S. **Risk:** High. **CWE:** 347.

### P1-07 — Wildcard CORS, including credentialed and WebSocket
**Evidence:** `packages/security-middleware/src/index.ts:44` — `const origin = opts.corsOrigin ?? process.env.CORS_ORIGIN ?? "*"; app.use(cors({ origin, credentials: true }))`. `services/graphql-gateway/src/main.ts:31` — `app.use(cors())` (defaults to `*`). `services/chat-service/src/chat.gateway.ts:5` — `@WebSocketGateway({ cors: { origin: '*' } })`. Every service env defaults `CORS_ORIGIN='*'`.
**Why it is a problem:** `origin:'*'` with `credentials:true` is invalid/dangerous and, where honored, allows any site to make credentialed cross-origin requests → CSRF-like data exfiltration.
**Production impact:** Cross-origin theft of authenticated responses.
**Recommended fix:** Explicit origin allowlist; never `*` with credentials.
**Effort:** S. **Risk:** High. **CWE:** 942.

### P1-08 — Admin guard accepts a static shared bearer token
**Evidence:** `app/backend/src/auth/admin.guard.ts:11` — `if (expected && token === expected) return true;` where `expected = process.env.ADMIN_API_TOKEN`.
**Why it is a problem:** A single static, non-expiring, non-rotating shared secret grants full admin. No per-admin identity, no revocation, no audit attribution. Timing-unsafe `===` comparison (minor timing-attack surface, CWE-208).
**Production impact:** Leaked token = permanent full admin; no way to attribute or revoke without redeploy.
**Recommended fix:** Per-admin JWT with roles; if a service token is needed, use short-lived signed tokens and constant-time compare.
**Effort:** M. **Risk:** High. **CWE:** 798, 208.

### P2-09 — K8s secrets committed as `stringData` templates (redacted but structurally present)
**Evidence:** `k8s/secrets/*.yaml` contain per-service `Secret` manifests with `JWT_SECRET`, `DATABASE_URL`, `MINIO_SECRET_KEY`, etc. Values currently show `"REDACTED"  # redacted`.
**Why it is a problem:** Committing secret manifests (even redacted) normalizes storing secrets in git; one bad commit reverts the redaction. There is an `k8s/external-secrets/` dir suggesting the correct pattern exists but both coexist.
**Production impact:** High risk of real secret leakage via history.
**Recommended fix:** Delete plaintext secret manifests; use ExternalSecrets/SealedSecrets exclusively.
**Effort:** S. **Risk:** Medium. **CWE:** 312/540.

### P2-10 — Password-hash cost / dummy-hash timing
**Evidence (positive-leaning):** `services/auth-service/src/auth/auth.service.ts:58-60` verifies against a `DUMMY_HASH` on the user-miss path to equalize timing (good). But `app/backend/scripts/seed.ts:7` seeds `bcrypt.hash('password123', 10)` and `services/auth-service/prisma/seed.ts:7` seeds `argon2.hash('Admin@12345')` — weak, well-known seed credentials.
**Why it is a problem:** If seed scripts run against a shared/staging DB, default admin `Admin@12345` is a live foothold.
**Production impact:** Default-credential admin access.
**Recommended fix:** Randomize seed passwords; never seed admin creds in shared envs.
**Effort:** S. **Risk:** Medium. **CWE:** 798.

---

## Positives (verified)
- `services/auth-service` uses **argon2** for password + refresh-token hashing, refresh-token rotation with reuse detection (`auth.service.ts:76-108`), and timing-equalized login.
- `packages/security-middleware/src/jwt.ts` supports proper JWKS-based verification with issuer/audience when `JWKS_URL` is configured.
- Helmet, HSTS, HPP, rate-limiting middleware exist (`packages/security-middleware`).
- `app/backend/src/common/database/prisma.safe.ts` restricts raw SQL to parameterized `Prisma.sql`.

## Stage score: **18/100** (Security)
Four independent P0s (header-trust auth bypass, optional JWT secret, hardcoded fallback secrets, unsigned payment webhook) each individually block production.
