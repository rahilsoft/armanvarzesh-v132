# Stage 08 Migration Plan
- پیشنهاد: `npx prisma migrate diff --from-empty --to-schema=./schema.prisma --script > ./migrations/INIT.sql`
- سپس: `npx prisma migrate resolve --applied <timestamp>_init`
- بعد: `npx prisma generate && npx prisma db push` (در dev)
