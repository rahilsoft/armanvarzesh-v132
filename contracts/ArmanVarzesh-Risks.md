# ArmanVarzesh — Risks (Evidence-Based)

## 1. Unused server routes (REST) — تعداد: 196
- **چرا مهم است:** کد مرده و هزینه نگهداری بالا + سطح حمله اضافه
- **تبعات ادامه‌دار:** هزینه DevOps و امنیت
- **نمونه شواهد:**
  - DELETE /:id @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/src/rewards.controller.ts:10
  - DELETE /:id @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/src/physio.controller.ts:10
  - DELETE /:id @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/src/assessments.controller.ts:10
  - DELETE /:id @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/src/analytics.controller.ts:10
  - DELETE /:id @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/booking.controller.ts:10

## 2. Client operations without server implementation (GraphQL) — تعداد: 70
- **چرا مهم است:** عدم انطباق Schema و Hookهای کلاینت
- **تبعات ادامه‌دار:** Crash یا error در زمان اجرا و build-time codegen
- **نمونه شواهد:**
  - AddNote (mutation) @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:39
  - ArchiveClient (mutation) @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/clients.queries.ts:33
  - AssignPlan (mutation) @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:50
  - BookReservation (mutation) @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/reservation.mutations.ts:3
  - CancelReservation (mutation) @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/reservation.mutations.ts:9

## 3. Client calls without server implementation (REST) — تعداد: 46
- **چرا مهم است:** عدم قطعیت قرارداد و شکست در زمان اجرا/انتشار
- **تبعات ادامه‌دار:** API شکسته و مسیرهای کلیدی UX بلااستفاده می‌شود
- **نمونه شواهد:**
  - GET /api/coaches @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/coaches/index.tsx:5
  - GET /api/coaches @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/coaches/index.tsx:5
  - GET /api/courses @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/courses/index.tsx:5
  - GET /api/courses @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-pwa/src/features/courses/index.tsx:5
  - GET /api/marketplace @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-pwa/src/features/marketplace/index.tsx:5

## 4. Unused GraphQL operations — تعداد: 6
- **چرا مهم است:** کد مرده در رزولورها
- **تبعات ادامه‌دار:** هزینه نگهداری و ریسک انحراف قرارداد
- **نمونه شواهد:**
  - Amount @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:23
  - Authority @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/controllers/payments.controller.ts:23
  - cursor @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/src/payments/payments.controller.ts:28
  - q @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.controller.ts:12
  - t @ /mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.controller.ts:18

