# Physio Service

REST API for corrective protocols, pain (VAS), ROM, and adherence.

## Endpoints

- `POST /physio/assign` { userId, protocolId }
- `GET /physio/plan/:userId`
- `POST /physio/session/:sessionId/complete`
- `POST /physio/session/:sessionId/pain` { score, notes? }  — limited to 1 per 2h
- `POST /physio/rom` { userId, joint, side, angle }
- `GET /physio/progress/:userId?from=ISO&to=ISO`
- `POST /physio/seed` { protocols: [...] }

### Example curl

```bash
curl -XPOST :4061/physio/seed -H 'content-type: application/json' -d '{"protocols":[{"id":"p1","name":"Knee Basic","area":"knee","weeks":4,"steps":[{"id":"s1","week":1,"day":1,"exerciseId":"bridge","seconds":30}]}] }'
curl -XPOST :4061/physio/assign -H 'content-type: application/json' -d '{"userId":"u1","protocolId":"p1"}'
curl :4061/physio/plan/u1
```


## Database
- Uses **PostgreSQL** via Prisma (`DATABASE_URL`).
- Run: `pnpm -F @arman/physio-service prisma:generate && pnpm -F @arman/physio-service prisma:migrate`
