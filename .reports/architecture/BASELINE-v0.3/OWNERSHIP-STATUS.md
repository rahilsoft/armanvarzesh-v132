# Canonical domain ownership map — v0.3 status update

The full keep/fold/retire contract remains
`.reports/architecture/DOMAIN-OWNERSHIP.md` (owner-approved, unchanged).
This snapshot adds current per-domain status.

## Core domains → modular monolith (Int PKs)

| Domain | Canonical module | Status | Notes |
|---|---|---|---|
| Auth | `app/backend/src/auth` (UserAuthModule) | ✅ **FOLDED** (Phase 3) | auth-service DEPRECATED; TOTP/password-reset port pending |
| Users | `app/backend/src/users` | ✅ **FOLDED** (Phase 4) | users-service DEPRECATED; data-loss bug fixed |
| Payments | `app/backend/src/payments` (+CheckoutService) | ✅ **FOLDED** (Phase 4) | payments-service DEPRECATED; HTTP surface pending (D12) |
| Workout | `app/backend/src/workouts` | ⏭️ **NEXT** | Payments-class fold: enrich primitive `Workout{data Json}` with workouts-service `WorkoutPlan/Exercise` model + 146-line service; de-dup activity-subgraph `Workout` |
| Nutrition | `app/backend/src/nutrition` | queued | nutrition-service + content-service Food/NutritionPlan/MealLog |
| Booking | `app/backend/src/reservations` | queued | booking-service Slot/Booking |
| Profiles | `app/backend/src/coaches` + new | queued | coaches-service, content-service Specialist*, ai-service CoachProfile |
| Orders/Marketplace | `app/backend/src/marketplace` | queued (Order model already landed via Payments) | marketplace-service |
| Courses | `app/backend` Course | queued | courses-service + certificate-service |
| Assessments | new module | queued | assessments-service |
| Medical | new module | queued | medical-service |
| Physio/Corrective | new module | queued | physio-service + subgraph + content-service Corrective* |
| Gamification | `app/backend` Challenge/Leaderboard | queued | challenges/rewards/vip/affiliate services |
| CMS/Content | `app/backend` Cms/Content | queued | content-service dismemberment (ownership matrix required first, per owner) |
| Corporate/Payroll/Support | `app/backend` | ✅ already monolith-only | no duplicates exist |

## Extension domains → dedicated microservices (UUID PKs) — all KEEP

AI (`ai-service`) · Recommendation (`predictive-service`) · Notifications
(`notifications-service` ← inbox-service) · Chat (`chat-service`) · Media
(`media-worker`→service) · Search (new, none exists) · Analytics
(`analytics-service` ← collector, kpis) · Activity (`activities-service`) ·
Social (`social-subgraph`) · Live (`live-subgraph`) · Background jobs
(`workers`, needs impl — now also the outbox relay owner per ADR-B5).

## Infra

`graphql-gateway` canonical edge (federation for extension layer);
`api-gateway` retire/demote decision open (ADR-INDEX §C).
