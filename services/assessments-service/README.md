# Assessments Service

Baseline/periodic assessments for Mobility/Strength/Endurance with rule-based scoring and recommendations.

## Endpoints
- `GET  /assessments` → catalog with sections/questions (admin/internal)
- `GET  /assessments/mine?status=` → user-scoped list
- `GET  /assessments/:id` → full definition (sections/questions)
- `POST /assessments/:id/start` → begin assessment (returns definition)
- `POST /assessments/:id/submit` body: `{ answers: [{questionId, value}] }` → returns `{ attemptId, score, recommendation }`
- `GET  /assessments/result/:attemptId`

*Auth:* Bearer JWT; `sub` به عنوان userId استفاده می‌شود.

## Dev
```bash
# DB migrate (Prisma)
pnpm -F @arman/assessments-service prisma:generate
pnpm -F @arman/assessments-service prisma:migrate

# Run
pnpm -F @arman/assessments-service build && pnpm -F @arman/assessments-service start

# Seed
ts-node services/assessments-service/prisma/seed.ts || node services/assessments-service/dist/prisma/seed.js
```
