-- CreateEnum
CREATE TYPE "CorrectiveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "Condition" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "nameFa" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectiveVideo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "equipment" TEXT,
    "notes" TEXT,
    "voiceUrl" TEXT,
    "uploadedBy" INTEGER NOT NULL,
    "status" "CorrectiveStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectiveVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectiveVideoCondition" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "conditionCode" TEXT NOT NULL,

    CONSTRAINT "CorrectiveVideoCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectiveProgress" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "itemKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorrectiveProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Condition_code_key" ON "Condition"("code");

-- CreateIndex
CREATE INDEX "idx_CorrectiveVideo_uploader" ON "CorrectiveVideo"("uploadedBy");

-- CreateIndex
CREATE INDEX "idx_CorrectiveVideo_status" ON "CorrectiveVideo"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectiveVideoCondition_videoId_conditionCode_key" ON "CorrectiveVideoCondition"("videoId", "conditionCode");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectiveProgress_assignmentId_dayIndex_itemKey_key" ON "CorrectiveProgress"("assignmentId", "dayIndex", "itemKey");

-- AddForeignKey
ALTER TABLE "CorrectiveVideoCondition" ADD CONSTRAINT "CorrectiveVideoCondition_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "CorrectiveVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectiveVideoCondition" ADD CONSTRAINT "CorrectiveVideoCondition_conditionCode_fkey" FOREIGN KEY ("conditionCode") REFERENCES "Condition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectiveProgress" ADD CONSTRAINT "CorrectiveProgress_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "PhysioAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

