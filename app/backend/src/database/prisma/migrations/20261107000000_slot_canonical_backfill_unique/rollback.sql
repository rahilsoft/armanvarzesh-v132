-- Manual rollback for 20261107000000_slot_canonical_backfill_unique.
-- Not run by `prisma migrate`. Afterwards delete this migration's row from
-- "_prisma_migrations".
--
-- Undone: backfilled Slot rows that nobody booked are removed, the unique
-- index is dropped, removed duplicate rows are restored and the keeper gets
-- its capacity from before the merge, raised to its active seats where the
-- moved seats need more (so seats <= capacity always holds).
-- Not undone (by design): Bookings and Reservations moved to the keeper stay
-- there, moving them back could overbook a restored row. Backfilled rows that
-- already carry a seat are kept. Dropped holds are not restored.
BEGIN;
-- Child tables first, the same order as a Booking insert (row lock on
-- Booking, then the FK check on Slot), so a concurrent writer waits instead
-- of deadlocking.
LOCK TABLE "Booking", "Reservation", "Slot", "AvailabilitySlot" IN EXCLUSIVE MODE;
DELETE FROM "Slot" s USING "_SlotCanonicalMigration" m
WHERE m."kind" = 'backfill' AND s."id" = m."ref"
  AND NOT EXISTS (SELECT 1 FROM "Booking" b WHERE b."slotId" = s."id")
  AND NOT EXISTS (SELECT 1 FROM "Reservation" r WHERE r."resourceId" = s."id");
DROP INDEX IF EXISTS "uq_Slot_coach_time";
UPDATE "Slot" k SET "capacity" = GREATEST(m."capacity", (
    SELECT COUNT(*) FROM "Booking" b WHERE b."slotId" = k."id" AND b."status" IN ('PENDING', 'CONFIRMED')
  ) + (
    SELECT COUNT(*) FROM "Reservation" r WHERE r."resourceId" = k."id" AND r."status" <> 'CANCELED'
  ))
FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'keeper' AND k."id" = m."ref";
INSERT INTO "Slot" ("id", "coachId", "startUTC", "endUTC", "capacity", "createdAt")
SELECT "ref", "coachId", "startUTC", "endUTC", "capacity", "createdAt"
FROM "_SlotCanonicalMigration" WHERE "kind" = 'merged'
ON CONFLICT ("id") DO NOTHING;
DROP TABLE "_SlotCanonicalMigration";
COMMIT;
