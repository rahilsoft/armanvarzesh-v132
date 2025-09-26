# Security Hardening — Arman Varzesh

This repo includes a baseline hardening set:
- **CSP** (Next headers) with `default-src 'self'` and limited `connect-src/img-src`.
- **SameSite=Lax** cookies (demo `av_role`) and middleware gate for `/wallet`, `/checkout`, `/admin`.
- **RBAC** policy (`packages/security/rbac.ts`) + React `Guard` for component-level checks.
- **PII masking** helpers in `packages/security/sanitize.ts` (maskEmail/maskPhone/scrubPII).
- **Auth Context** for demo role switching (replace with real auth provider in production).

## TODO for prod
- Replace demo cookie with secure session/JWT (HttpOnly, Secure, SameSite=Strict).
- Wire RBAC to server-side checks (BFF/Nest guards).
- Expand CSP to strict nonce/hashed scripts, and per-page directives if needed.
- Add rate limiting (gateway), and WAF rules for forms.
