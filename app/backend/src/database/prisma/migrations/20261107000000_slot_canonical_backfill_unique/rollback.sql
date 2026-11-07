-- Manual rollback for 20261107000000_slot_canonical_backfill_unique.
-- Not run by `prisma migrate`. Run inside a transaction, then remove the row
-- for this migration from "_prisma_migrations".
--
-- Removes backfilled Slot rows that nobody booked, drops the unique index and
-- restores merged duplicate rows (their Bookings and Reservations stay on the
-- keeper: moving them back is not safe once new seats were taken).
BEGIN;
DELETE FROM "Slot" s USING "_SlotCanonicalMigration" m
WHERE m."kind" = 'backfill' AND s."id" = m."slotId"
  AND NOT EXISTS (SELECT 1 FROM "Booking" b WHERE b."slotId" = s."id")
  AND NOT EXISTS (SELECT 1 FROM "Reservation" r WHERE r."resourceId" = s."id");
DROP INDEX IF EXISTS "uq_Slot_coach_time";
INSERT INTO "Slot" ("id", "coachId", "startUTC", "endUTC", "capacity", "createdAt")
SELECT "slotId", "coachId", "startUTC", "endUTC", "capacity", "createdAt"
FROM "_SlotCanonicalMigration" WHERE "kind" = 'merged'
ON CONFLICT ("id") DO NOTHING;
DROP TABLE "_SlotCanonicalMigration";
COMMIT;
