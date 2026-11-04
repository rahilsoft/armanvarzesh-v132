-- REV-20261022-01 follow-up: a CANCELED reservation must not block re-booking
-- its slot. The full unique key on (resourceId, startsAt, endsAt) from 0_init
-- kept cancelled history rows in the key, so a rebook hit P2002 (409).
--
-- Replace it with a partial unique index that only covers rows that still hold
-- the slot. Two concurrent active bookings of the same slot still race on this
-- index, so exactly one insert wins (unique_violation -> Prisma P2002 -> 409).
-- Cancelled rows are kept as history and are outside the index.
--
-- Prisma 5 cannot express partial indexes, so schema.prisma has no @@unique
-- for this key. Do not re-add it there: `migrate dev` would recreate the full
-- index and bring the bug back.

-- DropIndex
DROP INDEX "Reservation_resourceId_startsAt_endsAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "uq_Reservation_active_slot"
  ON "Reservation" ("resourceId", "startsAt", "endsAt")
  WHERE "status" <> 'CANCELED';
