# Feature × Platform Matrix — Execution Plan (v2, Phase 5)

| Feature       | Coach PWA | Coach iOS | Coach Android | User PWA | User iOS | User Android | Admin Web/PWA |
|---------------|-----------|-----------|---------------|----------|----------|--------------|---------------|
| Auth          | 🟢 `apps/backend` RBAC + `apps/*` login flows | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 Guarded admin |
| Nutrition     | 🟢 `apps/coach-pwa/src/features/nutrition/*` | 🟢 RN screen | 🟢 RN screen | 🟢 `apps/user-pwa/src/features/nutrition/*` | 🟢 RN screen | 🟢 RN screen | 🟢 reports (docs) |
| Chat          | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 moderation docs |
| Notifications | 🟢 WebPush | 🟢 APNs | 🟢 FCM | 🟢 WebPush | 🟢 APNs | 🟢 FCM | 🟢 Campaign docs |
| Payments      | 🟢 —Stripe | 🟢 RevenueCat | 🟢 RevenueCat | 🟢 —Stripe | 🟢 RevenueCat | 🟢 RevenueCat | 🟢 Refund/Reconcile |

> References:
> - Backend Notifications: `apps/backend/src/notifications/*`
> - Backend Nutrition: `apps/backend/src/nutrition/*`
> - Payments: `apps/backend/src/payments/*`
> - PWA Nutrition: `apps/*-pwa/src/features/nutrition/*`
> - RN Nutrition: `apps/*-app/src/features/NutritionScreen.tsx`
> - WebPush SW: `apps/*-pwa/public/sw.js`
