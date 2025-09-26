# Live Phase B — Prometheus Metrics + Admin Guard

## Metrics
- ماژول: `MetricsModule` (prom-client)
  - شمارنده‌ها: `live_tokens_issued_total`, `live_purchases_total`, `live_chats_total`, `live_reactions_total`, `live_joins_total`, `live_leaves_total`
  - Endpoint: `GET /metrics` (Prometheus exposition format)
- اینسترومنت:
  - `livekit.controller.ts` → token_issued
  - `live.gateway.ts` → join/leave/chat/reaction
  - `payment.controller.ts` → purchase_succeeded

## Health
- `GET /health` → `{ ok: true, ts }`

## Admin Guard
- بک‌اند: `AdminGuard` با `Authorization: Bearer <ADMIN_API_TOKEN>`
  - روی `liveevent.controller` (create/update/delete/tickets) و `analytics.controller` اعمال شده.
- فرانت‌اند: middleware و صفحهٔ `/admin/login` برای ست‌کردن کوکی `admin_token`؛
  - درخواست‌های Admin به بک‌اند هدر `Authorization` می‌فرستند.

## ENV
```
ADMIN_API_TOKEN=changeme
NEXT_PUBLIC_ADMIN_TOKEN=changeme
```
