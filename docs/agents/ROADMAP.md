# Arman Varzesh — agent team roadmap

Order = priority. The coordinator picks the top unblocked items each night.
Tick `[x]` only after the work is merged into `develop` **and** verified (commands in STATUS.md).
Owner of each item in brackets.

## Phase 0 — Foundation (security & topology)  — must finish first
- [ ] 0.1 Repoint docker-compose, Helm, k8s and CI at `app/backend`; remove deprecated `services/*` from every deploy path (folders stay until owner approves deletion). [coordinator-architect]
- [x] 0.2 Close P0-1 trusted `x-user-id` / `x-role` header auth everywhere still deployable. [security-reviewer + backend-engineer]
- [x] 0.3 Close P0-2 / P0-3: required `JWT_SECRET` (min 32) in production, remove all `|| 'dev'` / `'change_me'` fallbacks, pin JWT algorithms. [security-reviewer]
- [ ] 0.4 Close P0-4: payment webhooks / callbacks verified and idempotent (Zarinpal verify, Stripe signature). [backend-engineer]
- [ ] 0.5 Close P0-5: real Prisma migrations for the monolith DB, remove `db push` fallback. [backend-engineer]
- [ ] 0.6 Remaining P0/P1 items in `MASTER-REMEDIATION-PLAN.md`. [security-reviewer]
- [ ] 0.7 Test harness with real PostgreSQL + Redis in CI and in the agent sandbox. [qa-test-engineer]
- [ ] 0.9 Dependency upgrades as tested groups: jose 6 (needs Jest ESM transform in app/backend), @nestjs/* overrides, Expo SDK upgrade. [qa-test-engineer]
- [ ] 0.8 Mock / stub / placeholder sweep: inventory every fake path in production code into STATUS.md, then burn it down. [qa-test-engineer]

## Phase 1 — Design system
- [x] 1.1 Design tokens (dark emerald/cyan, RTL, Vazirmatn, spacing) in `packages/ui-tokens`. [ui-ux-designer]
- [ ] 1.2 Atomic component library in `packages/ui-components` (web) + RN equivalents. [ui-ux-designer + web-frontend-engineer + mobile-engineer]
- [ ] 1.3 Screen specs for every user, coach and admin flow in `docs/design/`, gamification visuals (XP, badges, levels). [ui-ux-designer]

## Phase 2 — Core modules, real end to end
- [ ] 2.1 Auth: OTP via Kavenegar, JWT access/refresh, roles (user / coach / admin), account deletion. [backend-engineer + mobile-engineer + web-frontend-engineer]
- [ ] 2.2 Subscription plans with admin-editable variable pricing. [backend-engineer + web-frontend-engineer]
- [ ] 2.3 Wallet & payments: Zarinpal checkout + verify, refunds, invoices, wallet top-up. [backend-engineer + mobile-engineer + web-frontend-engineer]
- [ ] 2.4 Workout plans + live WorkoutSession tracking (timers, sets, history). [backend-engineer + mobile-engineer]
- [ ] 2.5 Nutrition: meal plans, food logging, macros. [backend-engineer + mobile-engineer]
- [ ] 2.6 Notifications: Expo push (APNs/FCM), SMS, email, BullMQ scheduling. [backend-engineer + ios-engineer + android-engineer]
- [ ] 2.7 Media uploads to S3/MinIO with presigned URLs, MIME/size limits. [backend-engineer]

## Phase 3 — Growth & engagement
- [ ] 3.1 Affiliate + referral (codes, attribution, rewards, payouts). [backend-engineer + web-frontend-engineer]
- [ ] 3.2 VIP club (tiers, perks, gated content). [backend-engineer + mobile-engineer]
- [ ] 3.3 Challenges, XP, badges, leaderboards. [backend-engineer + mobile-engineer + ui-ux-designer]
- [ ] 3.4 Chat (coach ↔ user) and live sessions via LiveKit. [backend-engineer + mobile-engineer + ios-engineer + android-engineer]

## Phase 4 — AI
- [ ] 4.1 AI module through a provider adapter (key from env): plan generation, coach assistant. [backend-engineer]
- [ ] 4.2 AI-powered coach matching. [backend-engineer + mobile-engineer]

## Phase 5 — Admin panel complete
- [ ] 5.1 Admin: users, coaches, plans/pricing, payments/refunds, wallet, referrals, VIP, content, challenges, reports, roles. [web-frontend-engineer + backend-engineer]

## Phase 6 — Platform builds & release
- [ ] 6.1 `eas.json` profiles (development / preview / production) for user and coach apps. [ios-engineer + android-engineer]
- [ ] 6.2 iOS: push, HealthKit, privacy manifest, TestFlight path, distribution decision for Iran. [ios-engineer]
- [ ] 6.3 Android: FCM, Health Connect, Google Play + Cafe Bazaar + Myket builds and billing. [android-engineer]
- [ ] 6.4 Public site + admin production builds, Lighthouse budgets green. [web-frontend-engineer]
- [ ] 6.5 Full regression + security review → deploy-readiness checklist all green. [qa-test-engineer + security-reviewer + coordinator-architect]
