-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "nameFa" TEXT,
ADD COLUMN     "unitsJson" JSONB;

-- CreateTable
CREATE TABLE "NutritionTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "json" JSONB NOT NULL,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdBy" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "weeks" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "json" JSONB NOT NULL,
    "totalsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionPlanMealLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "mealKey" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT,
    "aiJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionPlanMealLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_NutritionTemplate_name" ON "NutritionTemplate"("name");

-- CreateIndex
CREATE INDEX "idx_NutritionPlan_user_status" ON "NutritionPlan"("userId", "status");

-- CreateIndex
CREATE INDEX "idx_NPMealLog_user_plan" ON "NutritionPlanMealLog"("userId", "planId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionPlanMealLog_planId_dayIndex_mealKey_key" ON "NutritionPlanMealLog"("planId", "dayIndex", "mealKey");

-- AddForeignKey
ALTER TABLE "NutritionPlanMealLog" ADD CONSTRAINT "NutritionPlanMealLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "NutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

