# Phase 3 — Nutrition Everywhere

## Backend
- Prisma models: FoodItem, MealPlan(+MealPlanItem), MealEntry(+MealEntryItem) with hot-path indexes.
- Endpoints:
  - GET/PUT `/nutrition/v1/users/{userId}/meal-plan`
  - GET/POST `/nutrition/v1/users/{userId}/meals` (date range)
  - GET `/nutrition/v1/users/{userId}/macros?date=YYYY-MM-DD`
- Aggregation and N+1-safe fetch: items loaded in batch; FoodItems fetched once per day aggregate.

## Clients
- PWA components under `src/features/nutrition/*` for user/coach.
- RN screen placeholder under `src/features/NutritionScreen.tsx`.

## Seed
- `apps/backend/src/database/seed/food_items.csv` with a few staples and seeder script.

## Migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev -n nutrition_init
node apps/backend/src/database/seed/seed-food.ts
```

## Acceptance
- Meal plan CRUD works, meal logging persists, daily macros computed consistently.
- RBAC checks to be wired to your existing guard/policy system in Phase 5 hardening.


## Offline & Parity
- **PWA**: IndexedDB cache (`src/lib/idb.ts`) + fallback نمایش داده‌ها در حالت آفلاین.
- **RN**: placeholder برای AsyncStorage/SQLite (`src/features/nutrition/offline.ts`).

## RBAC Hook
- کنترلر Nutrition از `req.user.role` برای enforce دسترسی استفاده می‌کند؛ به RolesGuard/Policy فعلی متصل کنید.

## E2E
- تست‌های placeholder ایجاد شد؛ روی CI به supertest/Detox متصل کنید.
