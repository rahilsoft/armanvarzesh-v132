# Testing Matrix — Phase 4

## Backend
- Root scripts:
  - `pnpm run test:backend` → uses `jest.backend.config.cjs` with coverage collection.
  - `pnpm run test:smoke` → API smoke (40 endpoints placeholder).

## Web/PWA (Next.js)
- Inside `app/site`:
  - `pnpm run test:e2e` → Playwright e2e (+ a11y via axe).
  - CI workflow: `.github/workflows/playwright.yml` (build + start + test).

## Mobile (React Native)
- Apps: `app/user-app`, `app/coach-app` (Detox scaffold).
  - iOS:
    - `pnpm run e2e:ios:build`
    - `pnpm run e2e:ios:test`
  - Android:
    - `pnpm run e2e:android:build`
    - `pnpm run e2e:android:test`
- CI workflow: `.github/workflows/mobile-ci.yml` (iOS on macOS runner).

> یادداشت: مقادیر دقیق Scheme، نام AVD، و مسیرهای باینری را مطابق پروژه واقعی تنظیم کنید.
