# Coach Service (Program Builder + Roster + Payouts)

- **Program templates**: draft → publish (immutable versions) → assign to users (versioned)
- **Roster**: adherence% (3 sess/week heuristic), last session, flags
- **Payouts**: request → admin approve → mark paid (outbox event on approve)

## API
- `POST /coach/templates` `{ name, content }` (draft v0)
- `PUT /coach/templates/:id` `{ name?, content? }` (only while draft)
- `POST /coach/templates/:id/publish` → creates version `+1` from draft and locks
- `POST /coach/templates/:id/assign` `{ userIds[] }` (must be published)
- `POST /coach/progress/record` `{ userId, templateId }` → increments completedSessions
- `GET /coach/roster` → list adherence%, lastSession, flags
- `POST /coach/payouts/request` `{ amountCents, notes? }` → pending
- `GET /coach/payouts/mine`
- Admin: `POST /coach/payouts/:id/approve`, `POST /coach/payouts/:id/mark-paid`

## Dev
```bash
pnpm -F @arman/coach-service prisma:generate
pnpm -F @arman/coach-service prisma:migrate
pnpm -F @arman/coach-service seed
pnpm -F @arman/coach-service build && pnpm -F @arman/coach-service start
# PORT=4093
```
