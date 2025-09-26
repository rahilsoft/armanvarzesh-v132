
## Persistence & Queue (added)
- **Prisma models**: DeviceToken, UserPreference, NotificationLog + enums (Channel, Platform, DeliveryStatus).
- **BullMQ** queue `notifications` with `NotificationProcessor` and exponential backoff + retries.
- **Providers** skeletons (WebPush/FCM/APNs) wired into the processor.

### Migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev -n notifications_init
```

### Run locally (Redis + server)
```bash
docker run -p 6379:6379 -d redis:7-alpine
pnpm -r --filter @arman/backend run start:dev
```


## Providers & DRY-RUN
Set `NOTIFICATIONS_DRY_RUN=true` to bypass external sends while exercising DB + queue + logs.
To enable real sends, integrate provider SDKs and Secrets (VAPID/FCM/APNs) and set DRY_RUN to false.

## End-to-End Checklist
- Register token from PWA/RN → `DeviceToken` upserted.
- Send API enqueues job → `NotificationLog(status=queued)`
- Worker processes job → calls provider(s) → updates `NotificationLog(status=delivered|failed)`
- Admin report reads from `NotificationLog` aggregations.
