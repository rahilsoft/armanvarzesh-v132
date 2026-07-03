-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SpecialistType" ADD VALUE 'PHYSICAL_THERAPIST';
ALTER TYPE "SpecialistType" ADD VALUE 'PSYCHOLOGIST';
ALTER TYPE "SpecialistType" ADD VALUE 'SPECIALIST';

-- AlterTable
ALTER TABLE "Specialist" ADD COLUMN     "activeAt" TIMESTAMP(3),
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "genderFocus" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "maxAge" INTEGER,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "thumbnailUrl" TEXT;

-- CreateTable
CREATE TABLE "SpecialistScore" (
    "id" SERIAL NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "role" "SpecialistType" NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "metrics" JSONB,
    "lastComputed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialistScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialistScoreHistory" (
    "id" SERIAL NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "role" "SpecialistType" NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "metrics" JSONB,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecialistScoreHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringWeights" (
    "id" SERIAL NOT NULL,
    "role" "SpecialistType" NOT NULL,
    "weights" JSONB NOT NULL,

    CONSTRAINT "ScoringWeights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_SpecScore_role_total" ON "SpecialistScore"("role", "totalScore");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialistScore_specialistId_role_key" ON "SpecialistScore"("specialistId", "role");

-- CreateIndex
CREATE INDEX "idx_SpecScoreHist" ON "SpecialistScoreHistory"("specialistId", "role", "at");

-- CreateIndex
CREATE UNIQUE INDEX "ScoringWeights_role_key" ON "ScoringWeights"("role");

