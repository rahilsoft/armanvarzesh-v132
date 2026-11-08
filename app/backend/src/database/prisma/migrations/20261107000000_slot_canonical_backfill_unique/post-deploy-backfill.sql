-- Post-deploy step for migration 20261107000000 (REV-20261107-01).
-- Not run by `prisma migrate`. Run once after the last pod of the previous
-- release (which still writes AvailabilitySlot) has stopped:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -1 -f post-deploy-backfill.sql
-- It is step 3 of migration.sql and is idempotent. A later run can add
-- occurrences of an old RRULE whose 90-day horizon moved with now(), it never
-- duplicates or removes a Slot.
LOCK TABLE "Slot", "AvailabilitySlot" IN EXCLUSIVE MODE;

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
      -- The cast rolls 24:00:00 or :60 over, recurrence.ts rejects them, so does this.
      IF length(rec.u) > 8 AND (substr(rec.u, 10, 2) >= '24' OR substr(rec.u, 12, 2) >= '60' OR substr(rec.u, 14, 2) >= '60') THEN
        RAISE EXCEPTION 'UNTIL time out of range';
      END IF;
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
