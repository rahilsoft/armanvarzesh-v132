# Prisma Dev Quickstart
1) `docker compose -f tools/prisma-plan/docker-compose.prisma.dev.yml up -d`
2) برای هر سرویس: اجرای `migrations/PLAN_stage08/db_init.sh` → تولید INIT.sql
3) `npx prisma generate && npx prisma db push`
