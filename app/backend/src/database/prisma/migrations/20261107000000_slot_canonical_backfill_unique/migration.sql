-- REV-20261107-01 and REV-20261107-02: Slot is the canonical availability table.
--
-- Safe on a database that already holds data, and idempotent: re-applying it
-- changes nothing. Every changed or skipped row is written to the ledger
-- "_SlotCanonicalMigration" so an operator can see it and rollback.sql (in
-- this folder) can undo what is undoable. Rollback limits are listed there.

-- prisma migrate sends this file as one query, which PostgreSQL runs as one
-- implicit transaction, so the lock below holds until the end of the file.
-- Writers that run during the migration (for example old pods in a rolling
-- deploy) must not book a duplicate row between the repoint and the delete:
-- Booking.slotId cascades on delete. Readers are not blocked.
-- Old pods keep writing AvailabilitySlot after this migration: run
-- post-deploy-backfill.sql (same step 3, idempotent) once the last old pod
-- is gone.
-- Lock order: child tables first, the order of a plain Booking insert (FK
-- check on Slot last). A writer that updates a Slot hold first and then
-- inserts can still deadlock with this lock. PostgreSQL then aborts one side
-- and everything rolls back, no data is changed. If the migration is the
-- victim, `prisma migrate deploy` fails: run `prisma migrate resolve
-- --rolled-back 20261107000000_slot_canonical_backfill_unique` and deploy
-- again, ideally while booking traffic is low.
LOCK TABLE "Booking", "Reservation", "Slot", "AvailabilitySlot" IN EXCLUSIVE MODE;

-- Ledger. kind / ref:
--   'keeper'          ref = Slot id kept for a duplicate group, capacity = its capacity before the merge
--   'merged'          ref = duplicate Slot id removed (row copy, plus any hold it carried)
--   'backfill'        ref = Slot id created from AvailabilitySlot "availabilitySlotId"
--   'skipped'         ref = AvailabilitySlot id not copied (end <= start)
--   'rrule_truncated' ref = AvailabilitySlot id copied as one occurrence, rule in "note"
--   'existing'        ref = AvailabilitySlot id whose range already had a Slot "keeperId"
CREATE TABLE IF NOT EXISTS "_SlotCanonicalMigration" (
  "kind"               TEXT    NOT NULL,
  "ref"                INTEGER NOT NULL,
  "keeperId"           INTEGER,
  "availabilitySlotId" INTEGER,
  "coachId"            INTEGER,
  "startUTC"           TIMESTAMP(3),
  "endUTC"             TIMESTAMP(3),
  "capacity"           INTEGER,
  "createdAt"          TIMESTAMP(3),
  "holdUserId"         INTEGER,
  "holdExpires"        TIMESTAMP(3),
  "note"               TEXT,
  PRIMARY KEY ("kind", "ref")
);

-- 1) Merge duplicate Slot rows (same coach, start and end) into the lowest id.
WITH d AS (
  SELECT s.*, MIN(s."id") OVER (PARTITION BY s."coachId", s."startUTC", s."endUTC") AS keeper,
         COUNT(*) OVER (PARTITION BY s."coachId", s."startUTC", s."endUTC") AS n
  FROM "Slot" s
)
INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "keeperId", "coachId", "startUTC", "endUTC", "capacity", "createdAt", "holdUserId", "holdExpires")
SELECT CASE WHEN "id" = keeper THEN 'keeper' ELSE 'merged' END, "id", keeper, "coachId", "startUTC", "endUTC", "capacity", "createdAt", "holdUserId", "holdExpires"
FROM d WHERE n > 1
ON CONFLICT DO NOTHING;

UPDATE "Booking" b SET "slotId" = m."keeperId"
FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'merged' AND b."slotId" = m."ref";

UPDATE "Reservation" r SET "resourceId" = m."keeperId"
FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'merged' AND r."resourceId" = m."ref";

-- The keeper offers what the group offered: the larger of the summed
-- capacity of the group and the seats now active on it, so seats <= capacity
-- holds and a cancelled seat reopens.
UPDATE "Slot" k SET "capacity" = GREATEST(k."capacity", g.cap, (
    SELECT COUNT(*) FROM "Booking" b WHERE b."slotId" = k."id" AND b."status" IN ('PENDING', 'CONFIRMED')
  ) + (
    SELECT COUNT(*) FROM "Reservation" r WHERE r."resourceId" = k."id" AND r."status" <> 'CANCELED'
  ))
FROM (SELECT "keeperId", SUM("capacity")::int AS cap FROM "_SlotCanonicalMigration"
      WHERE "kind" IN ('keeper', 'merged') GROUP BY "keeperId") g
WHERE k."id" = g."keeperId";

-- Holds on removed duplicates are dropped (they last minutes, the user can
-- hold the keeper again). They stay visible in the ledger.
DELETE FROM "Slot" s USING "_SlotCanonicalMigration" m
WHERE m."kind" = 'merged' AND s."id" = m."ref";

-- 2) One Slot per coach and time range, enforced by the database.
CREATE UNIQUE INDEX IF NOT EXISTS "uq_Slot_coach_time" ON "Slot" ("coachId", "startUTC", "endUTC");

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
