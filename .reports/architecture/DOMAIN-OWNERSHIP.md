# Canonical Domain Ownership Map (DRAFT — approval required before deletion)

> Decision (owner-approved): **documented hybrid** — a **modular monolith**
> (`app/backend`) for core transactional domains, **dedicated microservices** for
> independently-scalable / asynchronous domains. One canonical domain model and
> one canonical Prisma schema for the core. Strangler-ready: any monolith module
> must be extractable later without breaking its public API.
>
> Per the instruction *"document ownership for every domain before deleting
> duplicate implementations"*, **nothing is deleted yet**. This table is the
> deletion contract; deletions in the next stage follow it exactly.

Legend — **Canonical** = the single implementation we keep and harden.
**Fold** = migrate any unique models/logic into the canonical, then delete.
**Retire** = delete outright (duplicate or stub, no unique value).

---

## A. Core domains → modular monolith (`app/backend`)

Canonical Prisma schema: **one** schema at `app/backend/.../schema.prisma`.
Each domain is a module folder under `app/backend/src/<domain>` with a public
service API (the strangler seam).

| Domain | Canonical (keep) | Fold in (migrate unique parts, then delete) | Retire (pure duplicate/stub) | Canonical models |
|---|---|---|---|---|
| **Auth** | `app/backend/src/auth` | `services/auth-service` — **port the hardened selector/verifier refresh + rotation/theft-detection already written** | — | User(auth), Session, RefreshToken, Device, PasswordResetToken |
| **Users** | `app/backend/src/users` | — | `services/users-service` (bare `User` dup) | User |
| **Profiles** | `app/backend/src/coaches` + new `profiles` | `services/coaches-service` (Coach); `content-service` SpecialistProfile/SpecialistMeta/Score/UserProfile/UserMeta; `ai-service` CoachProfile | — | Coach, Specialist, SpecialistRating, UserProfile |
| **Payments** | `app/backend/src/payments` | `services/payments-service` (richer Product/CheckoutSession/Order/PaymentEvent/Outbox — migrate in) | — | Payment, Wallet, Refund, Subscription, WebhookEvent, IdempotencyKey |
| **Orders / Marketplace** | `app/backend/src/marketplace` | `services/marketplace-service`; payments-service `Order` | — | Marketplace, Order, Product |
| **Workout** | `app/backend/src/workouts` | `services/workouts-service` (WorkoutPlan/Exercise); `content-service` Plan* system (PlanDay/Block/Set/Assignment/Session — the real plan engine, migrate in) | `app/activity-subgraph` `Workout` dup | Workout, WorkoutPlan, Exercise, Plan* |
| **Nutrition** | `app/backend/src/nutrition` | `services/nutrition-service` (FoodItem/NutritionGoal/Hydration/Habit); `content-service` Food/NutritionTemplate/NutritionPlan/MealLog | — | Meal, Food, MealLog, NutritionPlan, NutritionGoal |
| **Booking** | `app/backend/src/reservations` | `services/booking-service` (Slot/Booking) | — | Reservation, AvailabilitySlot, Booking, Slot |
| **Courses / LMS** | `app/backend` (Course) | `services/courses-service`; `services/certificate-service` (Certificate) | — | Course, CourseAsset, Certificate |
| **Assessments** | `app/backend` new module | `services/assessments-service` (Assessment/Section/Question) | — | Assessment, Section, Question, AssessmentAttempt |
| **Medical** | `app/backend` new module | `services/medical-service` (Facility/Doctor/HealthTest/Appointment) | — | Facility, Doctor, HealthTest, Appointment |
| **Physio / Corrective** | `app/backend` new module | `services/physio-service`; `app/physio-subgraph`; `content-service` Corrective* | — | PhysioProtocol, PhysioStep, PhysioSession, CorrectiveVideo |
| **Gamification (Challenges/Rewards/VIP/Referral)** | `app/backend` (Challenge, LeaderboardEntry) | `services/challenges-service`; `services/rewards-service`; `services/vip-service`; `services/affiliate-service` | — | Challenge, PointEvent, Badge, Streak, VipTier, Referral, Commission |
| **CMS / Content tiles** | `app/backend` (Cms, Content) | `content-service` Tile/TileVersion/PublishAudit/FeatureFlag/Intake/Survey | — | Content, Cms, Tile, Survey |
| **Corporate / Payroll / Support** | `app/backend` (already present) | — | — | Corporate, Payroll, Support |

## B. Independently-scalable / async domains → dedicated microservices

Each keeps its **own** Prisma schema (bounded context, own DB/queue).

| Domain | Canonical service (keep) | Fold in | Retire (stub) |
|---|---|---|---|
| **AI** | `services/ai-service` | — | — |
| **Recommendation / ML** | `services/predictive-service` | `services/ml-service` (noop stub) | `ml-service` |
| **Notifications** | `services/notifications-service` | `services/inbox-service`; monolith `Notification`; content-service NotificationTask/DeviceToken | — |
| **Chat** | `services/chat-service` | `content-service` ChatThread/ChatMessage; monolith Message/Conversation/Attachment (chat parts) | — |
| **Media** | `services/media-worker` → promote to `media-service` | `content-service` MediaJob; monolith Vod | — |
| **Search** | *new service (none exists)* | — | — |
| **Analytics** | `services/analytics-service` | `services/analytics-collector`; `services/kpis-service`; monolith AnalyticsEntity | — |
| **Activity tracking** | `services/activities-service` | `app/activity-subgraph` (ActivityDaily/Goal/Trend) | — |
| **Social** | `app/social-subgraph` | monolith LeaderboardEntry (social parts) | — |
| **Live Streaming** | `app/live-subgraph` | monolith `Live`; content-service live parts | — |
| **Background Jobs** | `services/workers` (needs real impl) | outbox/queue workers scattered in services | — |

## C. Infrastructure (not a business domain — keep as-is)

- **Gateway:** keep **one** federation gateway. `services/graphql-gateway`
  (Apollo Federation, richer) is canonical; `services/api-gateway` (JS shim) →
  retire or demote to edge proxy. Decision deferred to the gateway stage.
- **Monitoring:** `services/monitoring-service` + `@arman/observability-sdk`
  (39 consumers) — keep.
- **Shared libs:** keep the 4 load-bearing packages
  (`observability-sdk`, `security-middleware`, `service-kit`, `integration`).
  Delete the 6 one-LOC placeholder packages (`auth`, `graphql`, `contracts`,
  `integrations`, `libs`, `theme`) and reassess the other 11 orphans per §D.

## D. Open items needing a one-line confirmation (do not block A/B)

1. **`content-service` (48 models)** is fully dismembered above — its parts are
   distributed across Workout/Nutrition/Profiles/CMS/Chat/Media/Notifications.
   Confirm the mega-service is **retired after fold** (not kept).
2. **Gamification** is large (4 services). Confirm it lives **in the monolith**
   (transactional, tightly coupled to Users/Payments) vs. its own service.
3. **Medical/Physio** — confirm monolith vs. a dedicated clinical service (they
   are semi-independent and could scale separately).

---

## Execution order once this table is approved (Strangler, safe increments)

1. Freeze the canonical monolith schema; add missing core models (Session,
   RefreshToken, Order, Plan*) with a migration.
2. Per core domain, **fold** unique logic into the monolith module behind its
   public service API, add tests, then **retire** the duplicate service in the
   same commit. One domain per commit → build/typecheck/lint/tests green each time.
3. Retire pure duplicates and stubs (users-service, ml-service, placeholder pkgs).
4. Rewrite `deploy/docker-compose.prod.yml` to deploy: monolith + the §B
   microservices + gateway + infra — replacing the current mismatch.
5. Each commit ships: architecture delta + tech-debt delta (per roadmap).
