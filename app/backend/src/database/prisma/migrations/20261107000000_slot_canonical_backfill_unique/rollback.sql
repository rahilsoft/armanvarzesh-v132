-- Manual rollback for 20261107000000_slot_canonical_backfill_unique.
-- Not run by `prisma migrate`. Afterwards delete this migration's row from
-- "_prisma_migrations".
--
-- Undone: backfilled Slot rows that nobody booked are removed, the unique
-- index is dropped, removed duplicate rows are restored and the keeper gets
-- its capacity from before the merge, raised to its active seats where the
-- moved seats need more (so seats <= capacity always holds). The raise is
-- taken off the restored duplicates, so each coach and range offers the same
-- total capacity as before the migration.
-- Not undone (by design): Bookings and Reservations moved to the keeper stay
-- there, moving them back could overbook a restored row. Backfilled rows that
-- already carry a seat are kept. Dropped holds are not restored.
BEGIN;
-- Lock order: child tables first, the order of a plain Booking insert (FK
-- check on Slot last). A writer that updates a Slot hold first and then
-- inserts can still deadlock with this lock. PostgreSQL then aborts one side
-- and everything rolls back, no data is changed. If the migration is the
-- victim, `prisma migrate deploy` fails: run `prisma migrate resolve
-- --rolled-back 20261107000000_slot_canonical_backfill_unique` and deploy
-- again, ideally while booking traffic is low.
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
-- The group must not offer more seats than before the migration: the extra
-- capacity the keeper still needs for moved seats is taken off the restored
-- duplicates (lowest id first, never below 0). They carry no seats.
WITH extra AS (
  SELECT m."ref" AS keeper, GREATEST(0, k."capacity" - m."capacity") AS n
  FROM "_SlotCanonicalMigration" m JOIN "Slot" k ON k."id" = m."ref" WHERE m."kind" = 'keeper'
), dup AS (
  SELECT m.*, SUM(m."capacity") OVER (PARTITION BY m."keeperId" ORDER BY m."ref") AS cum
  FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'merged'
)
INSERT INTO "Slot" ("id", "coachId", "startUTC", "endUTC", "capacity", "createdAt")
SELECT dup."ref", dup."coachId", dup."startUTC", dup."endUTC",
       dup."capacity" - LEAST(dup."capacity", GREATEST(0, COALESCE(extra.n, 0) - (dup.cum - dup."capacity")))::int,
       dup."createdAt"
FROM dup LEFT JOIN extra ON extra.keeper = dup."keeperId"
ON CONFLICT ("id") DO NOTHING;
DROP TABLE "_SlotCanonicalMigration";
COMMIT;
