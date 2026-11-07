-- Post-deploy step for migration 20261107000000 (REV-20261107-01).
-- Not run by `prisma migrate`. Run once after the last pod of the previous
-- release (which still writes AvailabilitySlot) has stopped:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -1 -f post-deploy-backfill.sql
-- It is step 3 of migration.sql and is idempotent.
LOCK TABLE "Slot", "AvailabilitySlot" IN EXCLUSIVE MODE;

-- 3) Backfill availability published through the legacy AvailabilitySlot
--    table (capacity 1, the GraphQL default). AvailabilitySlot is unique on
--    coach and range and is left untouched for rollback.
INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "coachId", "startUTC", "endUTC", "note")
SELECT 'skipped', a."id", a."coachId", a."startsAt", a."endsAt", 'end <= start'
FROM "AvailabilitySlot" a WHERE a."endsAt" <= a."startsAt"
ON CONFLICT DO NOTHING;

INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "coachId", "startUTC", "endUTC", "note")
SELECT 'rrule_truncated', a."id", a."coachId", a."startsAt", a."endsAt", a."rrule"
FROM "AvailabilitySlot" a WHERE a."rrule" IS NOT NULL AND a."rrule" <> '' AND a."endsAt" > a."startsAt"
ON CONFLICT DO NOTHING;

WITH ins AS (
  INSERT INTO "Slot" ("coachId", "startUTC", "endUTC", "capacity", "createdAt")
  SELECT a."coachId", a."startsAt", a."endsAt", 1, a."createdAt"
  FROM "AvailabilitySlot" a
  WHERE a."endsAt" > a."startsAt"
  ON CONFLICT ("coachId", "startUTC", "endUTC") DO NOTHING
  RETURNING "id", "coachId", "startUTC", "endUTC"
)
INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "availabilitySlotId", "coachId", "startUTC", "endUTC")
SELECT 'backfill', ins."id", a."id", ins."coachId", ins."startUTC", ins."endUTC"
FROM ins JOIN "AvailabilitySlot" a
  ON a."coachId" = ins."coachId" AND a."startsAt" = ins."startUTC" AND a."endsAt" = ins."endUTC"
ON CONFLICT DO NOTHING;

INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "keeperId", "availabilitySlotId", "coachId", "startUTC", "endUTC")
SELECT 'existing', a."id", sl."id", a."id", a."coachId", a."startsAt", a."endsAt"
FROM "AvailabilitySlot" a
JOIN "Slot" sl ON sl."coachId" = a."coachId" AND sl."startUTC" = a."startsAt" AND sl."endUTC" = a."endsAt"
WHERE NOT EXISTS (SELECT 1 FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'backfill' AND m."ref" = sl."id")
ON CONFLICT DO NOTHING;
