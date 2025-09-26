# Chat Service (WS + attachments)

Bi-directional chat (user↔coach) with Socket.IO, read receipts, typing, and attachments via pre-signed upload + AV scan webhook.

## WebSocket Events
- `typing` `{ typing: boolean }` → broadcast to thread
- `message:new` `{ clientMsgId, text?, attachments? }` → **idempotent** on `clientMsgId`
- `message:read` `{ messageId }` → emits to thread

Handshake query (demo): `?userId=...&threadId=...&role=user|coach`

## REST
- `GET  /chat/history/:threadId?limit=&cursor=` → پیام‌ها (cursor-based)
- `POST /chat/attachments/presign` `{ kind, sizeBytes, mime }` → returns `{ attachmentId, upload:{url,method,fields}, maxSize }`
- `POST /chat/webhooks/scan-result` `{ attachmentId, safe }` → marks `safe|quarantined`

## Limits
- MIME allowlist: `image/png,jpeg,webp,audio/mpeg,ogg,application/pdf`
- Max size: **10MB** each
- Duplicate client messages ignored by `clientMsgId`

## Dev
```bash
pnpm -F @arman/chat-service prisma:generate
pnpm -F @arman/chat-service prisma:migrate
pnpm -F @arman/chat-service build && pnpm -F @arman/chat-service start
pnpm -F @arman/chat-service seed
# PORT=4077
```
