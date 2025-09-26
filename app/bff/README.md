# BFF / Dashboard Bundle (GraphQL)

GraphQL endpoint that fans out to underlying services and returns a `DashboardBundle` with **TTL caching (60–120s)**. Slow/downstream failures are **collapsed into partials** with `warnings`.

## Run
```bash
pnpm -F @arman/bff build && pnpm -F @arman/bff start
# PORT=4091 → /graphql
```

## Sample Query
```graphql
query {
  dashboardBundle {
    todayWorkout { title sessionId plannedSets completedSets }
    nutritionSummary { date calories proteinG carbsG fatG }
    rewards { vipTier points streakDays }
    notifications { id title createdAt }
    warnings
  }
}
```

## Env
- `BOOKING_URL` (default `http://localhost:4069`)
- `ANALYTICS_URL` (default `http://localhost:4071`)
- `NOTIFS_URL` (default `http://localhost:4079`)
- `REWARDS_URL` (optional/demo)
