-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "speciality" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

