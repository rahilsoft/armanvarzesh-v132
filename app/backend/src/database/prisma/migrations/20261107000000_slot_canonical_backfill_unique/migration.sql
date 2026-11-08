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
--   'rrule_expanded'  ref = AvailabilitySlot id whose RRULE became one Slot per occurrence, rule and count in "note"
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
--
--    Recurrence (REV-20261107-01, decision 2026-11-08): a row with an RRULE
--    becomes one Slot per occurrence, the same policy as
--    src/reservations/recurrence.ts: FREQ=DAILY|WEEKLY, INTERVAL, COUNT or
--    UNTIL, BYDAY with WEEKLY, WKST=MO. Occurrences are computed on
--    Asia/Tehran wall-clock time, DTSTART is occurrence 1 and counts toward
--    COUNT, and the horizon is max(now, DTSTART) + 90 days. Past occurrences
--    after DTSTART (end <= now) are not created, they still count for COUNT.
--    A rule outside this subset stops the migration with the row ids,
--    nothing is shortened.
INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "coachId", "startUTC", "endUTC", "note")
SELECT 'skipped', a."id", a."coachId", a."startsAt", a."endsAt", 'end <= start'
FROM "AvailabilitySlot" a WHERE a."endsAt" <= a."startsAt"
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS pg_temp."_SlotRule";
CREATE TEMP TABLE "_SlotRule" AS
SELECT a."id", a."coachId", a."startsAt", a."endsAt", a."createdAt", a."rrule",
       NULLIF(rtrim(upper(regexp_replace(btrim(COALESCE(a."rrule", '')), '^rrule:', '', 'i')), ';'), '') AS r
FROM "AvailabilitySlot" a WHERE a."endsAt" > a."startsAt";

DO $$
DECLARE bad TEXT; rec RECORD;
BEGIN
  SELECT string_agg(x."id"::text || ' (' || x."rrule" || ')', ', ' ORDER BY x."id") INTO bad
  FROM "_SlotRule" x
  WHERE x.r IS NOT NULL AND NOT (
    x.r ~ '^(FREQ=(DAILY|WEEKLY)|INTERVAL=[1-9][0-9]{0,2}|COUNT=[1-9][0-9]{0,3}|UNTIL=[0-9]{8}(T[0-9]{6}Z)?|BYDAY=(MO|TU|WE|TH|FR|SA|SU)(,(MO|TU|WE|TH|FR|SA|SU))*|WKST=MO)(;(FREQ=(DAILY|WEEKLY)|INTERVAL=[1-9][0-9]{0,2}|COUNT=[1-9][0-9]{0,3}|UNTIL=[0-9]{8}(T[0-9]{6}Z)?|BYDAY=(MO|TU|WE|TH|FR|SA|SU)(,(MO|TU|WE|TH|FR|SA|SU))*|WKST=MO))*$'
    AND x.r ~ '(^|;)FREQ='
    AND NOT x.r ~ '(^|;)(FREQ|INTERVAL|COUNT|UNTIL|BYDAY|WKST)=.*;\2='
    AND NOT (x.r ~ '(^|;)COUNT=' AND x.r ~ '(^|;)UNTIL=')
    AND NOT (x.r ~ '(^|;)BYDAY=' AND x.r !~ '(^|;)FREQ=WEEKLY')
  );
  -- UNTIL must be a real date and time (the regex only checks digits).
  FOR rec IN SELECT x."id", x."rrule", substring(x.r from 'UNTIL=([0-9T]+Z?)') AS u FROM "_SlotRule" x WHERE x.r ~ '(^|;)UNTIL=' ORDER BY x."id" LOOP
    BEGIN
      PERFORM (substr(rec.u, 1, 8) || CASE WHEN length(rec.u) > 8 THEN ' ' || substr(rec.u, 10, 6) ELSE '' END)::timestamp;
    EXCEPTION WHEN others THEN
      bad := concat_ws(', ', bad, rec."id"::text || ' (' || rec."rrule" || ')');
    END;
  END LOOP;
  IF bad IS NOT NULL THEN
    RAISE EXCEPTION 'REV-20261107-01: AvailabilitySlot rows with an RRULE outside the supported subset, not migrated: %', bad;
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp."_SlotOccurrence";
CREATE TEMP TABLE "_SlotOccurrence" AS
WITH p AS (
  SELECT x.*,
    (x."startsAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Tehran' AS local0,
    x."endsAt" - x."startsAt" AS dur,
    substring(x.r from 'FREQ=([A-Z]+)') AS freq,
    COALESCE(substring(x.r from 'INTERVAL=([0-9]+)')::int, 1) AS intv,
    substring(x.r from 'COUNT=([0-9]+)')::int AS cnt,
    substring(x.r from 'UNTIL=([0-9T]+Z?)') AS until_raw,
    string_to_array(substring(x.r from 'BYDAY=([A-Z,]+)'), ',') AS byday,
    GREATEST((now() AT TIME ZONE 'UTC')::timestamp(3), x."startsAt") + interval '90 days' AS horizon
  FROM "_SlotRule" x
), q AS (
  SELECT p.*, CASE
      WHEN p.until_raw IS NULL THEN NULL
      WHEN length(p.until_raw) = 8
        THEN (((p.until_raw::date + 1)::timestamp AT TIME ZONE 'Asia/Tehran') AT TIME ZONE 'UTC') - interval '1 millisecond'
      ELSE (substr(p.until_raw, 1, 8) || ' ' || substr(p.until_raw, 10, 6))::timestamp
    END AS until_utc
  FROM p
), occ AS (
  SELECT q."id", q."coachId", q."createdAt", q.cnt, q."startsAt" AS st, q."endsAt" AS en, 0 AS k FROM q
  UNION ALL
  SELECT q."id", q."coachId", q."createdAt", q.cnt, c.st, c.st + q.dur, c.d
  FROM q
  CROSS JOIN LATERAL (
    SELECT d, (((q.local0 + d * interval '1 day') AT TIME ZONE 'Asia/Tehran') AT TIME ZONE 'UTC')::timestamp(3) AS st,
           q.local0 + d * interval '1 day' AS lt
    FROM generate_series(1, GREATEST(0, ceil(EXTRACT(EPOCH FROM (q.horizon - q."startsAt")) / 86400)::int + 1)) d
  ) c
  WHERE q.freq IS NOT NULL
    AND c.st < q.horizon
    AND (q.until_utc IS NULL OR c.st <= q.until_utc)
    AND (
      (q.freq = 'DAILY' AND c.d % q.intv = 0)
      OR (q.freq = 'WEEKLY' AND q.byday IS NULL AND c.d % (7 * q.intv) = 0)
      OR (q.freq = 'WEEKLY' AND q.byday IS NOT NULL
          AND (ARRAY['MO','TU','WE','TH','FR','SA','SU'])[EXTRACT(ISODOW FROM c.lt)::int] = ANY (q.byday)
          AND ((date_trunc('week', c.lt)::date - date_trunc('week', q.local0)::date) / 7) % q.intv = 0)
    )
), numbered AS (
  SELECT occ.*, row_number() OVER (PARTITION BY occ."id" ORDER BY occ.st) AS n FROM occ
)
SELECT "id", "coachId", "createdAt", st, en, n FROM numbered
WHERE (cnt IS NULL OR n <= cnt) AND (n = 1 OR en > (now() AT TIME ZONE 'UTC'));

INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "coachId", "startUTC", "endUTC", "note")
SELECT 'rrule_expanded', x."id", x."coachId", x."startsAt", x."endsAt",
       x."rrule" || ' => ' || (SELECT COUNT(*) FROM "_SlotOccurrence" o WHERE o."id" = x."id") || ' occurrences'
FROM "_SlotRule" x WHERE x.r IS NOT NULL
ON CONFLICT DO NOTHING;

WITH ins AS (
  INSERT INTO "Slot" ("coachId", "startUTC", "endUTC", "capacity", "createdAt")
  SELECT DISTINCT ON (o."coachId", o.st, o.en) o."coachId", o.st, o.en, 1, o."createdAt"
  FROM "_SlotOccurrence" o
  ORDER BY o."coachId", o.st, o.en, o."id"
  ON CONFLICT ("coachId", "startUTC", "endUTC") DO NOTHING
  RETURNING "id", "coachId", "startUTC", "endUTC"
)
INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "availabilitySlotId", "coachId", "startUTC", "endUTC", "note")
SELECT DISTINCT ON (ins."id") 'backfill', ins."id", o."id", ins."coachId", ins."startUTC", ins."endUTC",
       CASE WHEN o.n > 1 THEN 'rrule occurrence ' || o.n END
FROM ins JOIN "_SlotOccurrence" o
  ON o."coachId" = ins."coachId" AND o.st = ins."startUTC" AND o.en = ins."endUTC"
ORDER BY ins."id", o."id"
ON CONFLICT DO NOTHING;

INSERT INTO "_SlotCanonicalMigration" ("kind", "ref", "keeperId", "availabilitySlotId", "coachId", "startUTC", "endUTC")
SELECT DISTINCT ON (o."id") 'existing', o."id", sl."id", o."id", o."coachId", o.st, o.en
FROM "_SlotOccurrence" o
JOIN "Slot" sl ON sl."coachId" = o."coachId" AND sl."startUTC" = o.st AND sl."endUTC" = o.en
WHERE NOT EXISTS (SELECT 1 FROM "_SlotCanonicalMigration" m WHERE m."kind" = 'backfill' AND m."ref" = sl."id")
ORDER BY o."id", o.st
ON CONFLICT DO NOTHING;

DROP TABLE pg_temp."_SlotOccurrence";
DROP TABLE pg_temp."_SlotRule";
