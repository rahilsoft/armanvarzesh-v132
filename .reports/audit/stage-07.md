# Stage 07 — Frontend Audit

**Source of truth:** repository only.
Frontends found: `apps/web-site` (Next.js), `apps/admin-web`, `apps/mobile-user` (Expo/RN), plus `mobile/user`, `mobile/coach` (thin), and a root `src/` (admin components in `.ts`).

---

## Findings

### P1-01 — `apps/admin-web` ships two conflicting build systems and two routers
**Evidence:** `apps/admin-web/` contains **both** `next.config.js` **and** `vite.config.ts`, plus both `app/` and `pages/` directories, plus `index.html` (Vite entry) and Next config.
**Why it is a problem:** Next.js and Vite are mutually exclusive app frameworks. The repo cannot deterministically build this app; whichever runs, half the config is dead. `app/` + `pages/` also mixes Next App Router and Pages Router.
**Production impact:** Non-reproducible/ambiguous frontend build; likely one toolchain is dead code.
**Recommended fix:** Pick Next **or** Vite; delete the other's config and entry.
**Effort:** M. **Risk:** Medium.

### P2-02 — `apps/web-site` mixes App Router and Pages Router
**Evidence:** `apps/web-site/app/` (App Router: `robots.ts`, `sitemap.ts`, `admin/anatomy/three/page.tsx`) **and** `apps/web-site/pages/` (`_document.tsx`, `live/host/[room].tsx`) coexist. Also a stray `next.config.PHASE5_SNIPPET.js` alongside `next.config.js`.
**Why it is a problem:** Dual routers are supported but discouraged; routing precedence bugs and duplicated layout logic are common. The `PHASE5_SNIPPET` file is an un-applied config fragment.
**Production impact:** Routing ambiguity, hydration mismatches.
**Recommended fix:** Migrate fully to App Router; remove snippet file.
**Effort:** M. **Risk:** Medium.

### P2-03 — Root `src/` "frontend" is `.ts` stubs, not real components
**Evidence:** `src/pages/LoginPage.ts`, `src/screens/DashboardScreen.ts`, `src/components/Reward/RewardList.ts`, `src/context/RewardContext.ts` — React UI written as plain `.ts` (not `.tsx`), at repo root, outside any app workspace listed in `pnpm-workspace.yaml` (root is not a workspace package for these).
**Why it is a problem:** Dead or orphaned UI scaffolding; not part of any buildable app; confuses the "which frontend is real" question.
**Production impact:** None runtime; dead code.
**Recommended fix:** Delete or fold into a real app.
**Effort:** S. **Risk:** Low.

### P3-04 — Accessibility/perf tooling present but coverage unverifiable
**Evidence:** `ErrorBoundary` exists in `apps/admin-web/src/components/common/ErrorBoundary.tsx` and `apps/web-site/components/ErrorBoundary.tsx` (good). Lazy/`Suspense`/`dynamic()` used in a handful of `apps/web-site` pages. Lighthouse configs (5 of them, Stage 01) and `.lighthouserc.json` exist. `next-sitemap.config.js`, `app/robots.ts`, `app/sitemap.ts` present (SEO baseline OK).
**Why it is a problem:** Error boundaries and lazy-loading are used in only a few files; no evidence they wrap the app shell globally. Bundle-splitting is ad hoc.
**Production impact:** Unhandled render errors outside the few wrapped trees; larger initial bundles.
**Recommended fix:** Wrap app root in an ErrorBoundary; audit code-splitting.
**Effort:** M. **Risk:** Low.

---

## Positives (verified)
- Apollo client configured (`apps/admin-web/src/apollo/client.ts`) with typed hooks (`useCoach`, `useUser`, `usePayment`, …).
- SEO primitives (robots, sitemap, `_document`) present for `web-site`.
- Error boundaries and Lighthouse budgets exist.

## Stage score: **50/100** (Frontend)
Reasonable building blocks undermined by the admin-web dual-toolchain and router mixing.
