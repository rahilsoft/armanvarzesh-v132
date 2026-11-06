-- REV-20261106-02: Booking and Reservation share Slot.capacity.
--
-- 1) A hold belongs to the user who placed it. Only that user may book or
--    reserve a held slot until the hold expires.
ALTER TABLE "Slot" ADD COLUMN "holdUserId" INTEGER;

-- 2) Seat count is now enforced by a Serializable transaction that counts
--    active Booking and Reservation rows against Slot.capacity (both write
--    paths). The partial unique index allowed only one active Reservation per
--    slot, which rejected a free seat on a slot with capacity > 1.
DROP INDEX IF EXISTS "uq_Reservation_active_slot";
CREATE INDEX "idx_Reservation_resource_status" ON "Reservation" ("resourceId", "status");
