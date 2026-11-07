-- REV-20261107-01 and REV-20261107-02: Slot is the canonical availability table.
--
-- Safe to run on a database that already holds data, and idempotent: every
-- step is a no-op when re-applied. Rollback: see rollback.sql in this folder.

-- Ledger of rows this migration changes, so rollback is exact.
CREATE TABLE IF NOT EXISTS "_SlotCanonicalMigration" (
  "slotId"             INTEGER NOT NULL,
  "kind"               TEXT    NOT NULL, -- 'backfill' | 'merged'
  "availabilitySlotId" INTEGER,
  "keeperId"           INTEGER,
  "coachId"            INTEGER,
  "startUTC"           TIMESTAMP(3),
  "endUTC"             TIMESTAMP(3),
  "capacity"           INTEGER,
  "createdAt"          TIMESTAMP(3),
  PRIMARY KEY ("slotId", "kind")
);

-- 1) Merge duplicate Slot rows (same coach, start and end) into the lowest id.
--    Bookings and Reservations move to the keeper, the keeper keeps the
--    largest capacity, holds on the duplicates are dropped. Every merged row
--    is recorded in the ledger first.
WITH d AS (
  SELECT s."id", s."coachId", s."startUTC", s."endUTC", s."capacity", s."createdAt",
         MIN(s."id") OVER (PARTITION BY s."coachId", s."startUTC", s."endUTC") AS keeper
  FROM "Slot" s
)
INSERT INTO "_SlotCanonicalMigration" ("slotId", "kind", "keeperId", "coachId", "startUTC", "endUTC", "capacity", "createdAt")
SELECT "id", 'merged', keeper, "coachId", "startUTC", "endUTC", "capacity", "createdAt" FROM d WHERE "id" <> keeper
ON CONFLICT DO NOTHING;

UPDATE "Slot" k SET "capacity" = GREATEST(k."capacity", m.maxcap)
FROM (SELECT "keeperId", MAX("capacity") AS maxcap FROM "_SlotCanonicalMigration"
      WHERE "kind" = 'merged' GROUP BY "keeperId") m
WHERE k."id" = m."keeperId";

UPDATE "Booking" b SET "slotId" = m."keeperId"
FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'merged' AND b."slotId" = m."slotId";

UPDATE "Reservation" r SET "resourceId" = m."keeperId"
FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'merged' AND r."resourceId" = m."slotId";

DELETE FROM "Slot" s USING "_SlotCanonicalMigration" m
WHERE m."kind" = 'merged' AND s."id" = m."slotId";

-- 2) One Slot per coach and time range, enforced by the database.
CREATE UNIQUE INDEX IF NOT EXISTS "uq_Slot_coach_time" ON "Slot" ("coachId", "startUTC", "endUTC");

-- 3) Backfill availability published through the legacy AvailabilitySlot
--    table into Slot (capacity 1, the GraphQL default). A row whose range is
--    invalid (end <= start) is skipped. A recurrence rule cannot be stored on
--    Slot, so only the stored occurrence (startsAt..endsAt) is carried over.
--    AvailabilitySlot itself is left untouched for rollback.
WITH ins AS (
  INSERT INTO "Slot" ("coachId", "startUTC", "endUTC", "capacity", "createdAt")
  SELECT a."coachId", a."startsAt", a."endsAt", 1, a."createdAt"
  FROM "AvailabilitySlot" a
  WHERE a."endsAt" > a."startsAt"
  ON CONFLICT ("coachId", "startUTC", "endUTC") DO NOTHING
  RETURNING "id", "coachId", "startUTC", "endUTC"
)
INSERT INTO "_SlotCanonicalMigration" ("slotId", "kind", "availabilitySlotId")
SELECT ins."id", 'backfill', a."id"
FROM ins JOIN "AvailabilitySlot" a
  ON a."coachId" = ins."coachId" AND a."startsAt" = ins."startUTC" AND a."endsAt" = ins."endUTC"
ON CONFLICT DO NOTHING;
