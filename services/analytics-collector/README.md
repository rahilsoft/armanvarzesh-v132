# Analytics Collector & KPIs Service

Ingests events with idempotency + privacy sanitization, computes KPIs (DAU/MAU, conversion, adherence), and exports CSV.

## Privacy
- Drops raw PII keys: `email, phone, name, firstName, lastName, address`
- Stores SHA256 hash of dropped values using `ANALYTICS_SALT`

## Endpoints
- `POST /analytics/track` `{ eventName, props?, ts?, idempotencyKey }`  — user from JWT `sub`
- `GET  /kpis?from=&to=` → `{ mau, days:[{date, dau, sessions, signups, purchases, adherence, conversionSignupToSub}] }`
- `POST /kpis/cron/rollup?from=&to=` → upsert into `KpiDaily`
- `GET  /kpis/export.csv?from=&to=`

## Dev
```bash
pnpm -F @arman/analytics-collector prisma:generate
pnpm -F @arman/analytics-collector prisma:migrate
pnpm -F @arman/analytics-collector build && pnpm -F @arman/analytics-collector start
pnpm -F @arman/analytics-collector seed
```
