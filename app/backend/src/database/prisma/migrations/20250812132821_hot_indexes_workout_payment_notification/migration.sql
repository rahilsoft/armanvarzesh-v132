CREATE INDEX IF NOT EXISTS "idx_Workout_userId_createdAt" ON "Workout" ("userId","createdAt");
CREATE INDEX IF NOT EXISTS "idx_Payment_userId" ON "Payment" ("userId");
CREATE INDEX IF NOT EXISTS "idx_Payment_createdAt" ON "Payment" ("createdAt");
CREATE INDEX IF NOT EXISTS "idx_Payment_status" ON "Payment" ("status");
CREATE INDEX IF NOT EXISTS "idx_Payment_authority" ON "Payment" ("authority");
CREATE INDEX IF NOT EXISTS "idx_Notification_userId" ON "Notification" ("userId");
CREATE INDEX IF NOT EXISTS "idx_Notification_createdAt" ON "Notification" ("createdAt");
-- NOTE: Validate on staging before prod.