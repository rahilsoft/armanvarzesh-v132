# Notifications Service (Templates + Scheduler)

Multilang templates (MJML/Handlebars), channel fanout (push/email/SMS), quiet hours, retry with backoff, and ICS attachment support.

## API
- `POST /notifications/schedule` `{ templateKey, data, sendAt, channels[], locale?, tz? }`
- `POST /notifications/preview` `{ templateKey, data, locale? }` → `{ subject, html }`
- `POST /notifications/cron/process` → process due queue (retry/backoff)
- `GET  /notifications/outbox?limit=` → recent payloads (simulated dispatch)

### Quiet Hours
- Defaults: 22:00–07:00 (user TZ). Requests inside quiet hours are **shifted** به 07:00.
- Override via env: `QUIET_START_HOUR`, `QUIET_END_HOUR`

### ICS Attachments
Pass `data.ics = { title, startUTC, endUTC, location?, description? }` — service generates a valid `.ics` string and includes in outbox payloads.

## Dev
```bash
pnpm -F @arman/notifications-service prisma:generate
pnpm -F @arman/notifications-service prisma:migrate
pnpm -F @arman/notifications-service build && pnpm -F @arman/notifications-service start
# PORT=4079
```
