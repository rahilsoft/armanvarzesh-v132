# Live Phase A — Webhook Token, Prisma VOD (optional), Replay UI

## Webhook
- Endpoint: `POST /live/egress/webhook`
- Security (MVP): header `x-livekit-token` must match `LIVEKIT_WEBHOOK_TOKEN` (if set).
  - برای تولید، امضای HMAC را اضافه کنید.

## VOD Persistence
- `schema.prisma`: مدل `Vod` و `VodStatus` اضافه شد.
- `VodService` اگر `DATABASE_URL` تنظیم باشد از Prisma استفاده می‌کند، در غیر این صورت فایل `app/backend/data/vod-registry.json`.
- Endpoints: `GET /vod`, `GET /vod/:room`

## Replay UI (Web)
- صفحات: `/vod` و `/vod/[room]` — نمایش لیست و پخش (`.m3u8` یا mp4).
- از `NEXT_PUBLIC_API_BASE` برای فراخوانی API استفاده می‌کنند.

## Migrate
```
pnpm --filter @arman/backend run prisma:generate
pnpm --filter @arman/backend run prisma:migrate
```
