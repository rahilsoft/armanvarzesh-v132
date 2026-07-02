-- AlterTable
ALTER TABLE "Marketplace" ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "type" TEXT;

-- CreateIndex
CREATE INDEX "idx_Marketplace_type" ON "Marketplace"("type");

