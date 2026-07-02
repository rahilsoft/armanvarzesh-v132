-- CreateTable
CREATE TABLE "Slot" (
    "id" SERIAL NOT NULL,
    "coachId" INTEGER NOT NULL,
    "startUTC" TIMESTAMP(3) NOT NULL,
    "endUTC" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "holdToken" TEXT,
    "holdExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "slotId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "paymentRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_Slot_coach_start" ON "Slot"("coachId", "startUTC");

-- CreateIndex
CREATE INDEX "idx_Slot_holdExpires" ON "Slot"("holdExpires");

-- CreateIndex
CREATE INDEX "idx_Booking_user_status" ON "Booking"("userId", "status");

-- CreateIndex
CREATE INDEX "idx_Booking_slot_status" ON "Booking"("slotId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_Reservation_id_version" ON "Reservation"("id", "version");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

