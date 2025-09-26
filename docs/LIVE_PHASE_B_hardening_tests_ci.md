# Live Phase B — Security Hardening, Tests, CI

## Admin Passwords → Bcrypt
- `ADMIN_USERS_JSON` اکنون می‌تواند به‌جای `p` از `h` استفاده کند (bcrypt hash).
- ابزار ساخت هش:
  ```bash
  node app/backend/scripts/hash-admin.js <password>
  ```

## Middleware (Next.js)
- حفاظت `/admin/**` فقط با وجود کوکی `admin_token` (JWT).  
- حذف مسیر ورود از طریق `?token=` (ناامن).

## Tests (Jest)
- `admin.controller.spec.ts` — ورود موفق/ناموفق.
- `admin.jwt.guard.spec.ts` — تایید JWT معتبر/نامعتبر.
- `roles.guard.spec.ts` — انطباق نقش‌ها.

## CI (GitHub Actions)
- Workflow: `live-ci.yml`
  - Node 20 + pnpm 9.6
  - نصب، lint (اختیاری)، اجرای تست‌های بک‌اند.

## ENV نمونه
```
ADMIN_JWT_SECRET=supersecret
ADMIN_USERS_JSON=[{"u":"admin","h":"<bcrypt-hash>","r":"owner"}]
```
