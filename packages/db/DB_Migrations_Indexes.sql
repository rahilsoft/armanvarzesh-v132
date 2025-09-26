-- Auto-generated index migration for high-traffic tables
-- Generated at 2025-08-12T18:00:41.572509Z

-- prisma/schema.prisma not found; provide generic templates below.
/*
CREATE INDEX IF NOT EXISTS "idx_workout_user_ts" ON "Workout" ("userId","startTime");
CREATE INDEX IF NOT EXISTS "idx_payment_user_status_ts" ON "Payment" ("userId","status","createdAt");
CREATE INDEX IF NOT EXISTS "idx_notification_user_read_ts" ON "Notification" ("userId","read","createdAt");
*/