-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "geoLat" DOUBLE PRECISION,
    "geoLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "facilityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthTest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "requiresFasting" BOOLEAN NOT NULL DEFAULT false,
    "facilityId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestBundle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestBundleOnTest" (
    "bundleId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "TestBundleOnTest_pkey" PRIMARY KEY ("bundleId","testId")
);

-- CreateTable
CREATE TABLE "ClinicSlot" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "startUTC" TIMESTAMP(3) NOT NULL,
    "endUTC" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "holds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "clinicSlotId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "fasting" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultId" INTEGER,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthTest_code_key" ON "HealthTest"("code");

-- CreateIndex
CREATE INDEX "idx_ClinicSlot_doctor_start" ON "ClinicSlot"("doctorId", "startUTC");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_resultId_key" ON "Appointment"("resultId");

-- CreateIndex
CREATE INDEX "idx_Appointment_user_status" ON "Appointment"("userId", "status");

-- CreateIndex
CREATE INDEX "idx_Appointment_slot_status" ON "Appointment"("clinicSlotId", "status");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthTest" ADD CONSTRAINT "HealthTest_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestBundleOnTest" ADD CONSTRAINT "TestBundleOnTest_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "TestBundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestBundleOnTest" ADD CONSTRAINT "TestBundleOnTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "HealthTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSlot" ADD CONSTRAINT "ClinicSlot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicSlotId_fkey" FOREIGN KEY ("clinicSlotId") REFERENCES "ClinicSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

