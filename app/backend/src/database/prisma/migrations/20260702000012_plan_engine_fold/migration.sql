-- CreateEnum
CREATE TYPE "PlanKind" AS ENUM ('WORKOUT', 'CORRECTIVE', 'NUTRITION');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('SINGLE', 'SUPERSET', 'TRISET', 'CIRCUIT');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "kind" "PlanKind" NOT NULL DEFAULT 'WORKOUT',
    "ownerId" INTEGER,
    "createdBy" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanDay" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "note" TEXT,
    "voiceUrl" TEXT,

    CONSTRAINT "PlanDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanBlock" (
    "id" SERIAL NOT NULL,
    "dayId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "BlockType" NOT NULL DEFAULT 'SINGLE',
    "section" TEXT,
    "protocol" TEXT,
    "protocolParams" JSONB,
    "rounds" INTEGER,
    "restBetweenItemsSec" INTEGER,

    CONSTRAINT "PlanBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanBlockItem" (
    "id" SERIAL NOT NULL,
    "blockId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "PlanBlockItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSet" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" DOUBLE PRECISION,
    "rest" INTEGER,
    "tempo" TEXT,
    "rpe" DOUBLE PRECISION,
    "durationSec" INTEGER,
    "targetWeight" DOUBLE PRECISION,
    "targetRPE" DOUBLE PRECISION,

    CONSTRAINT "PlanSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanAssignment" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "sessionsPerWeek" INTEGER NOT NULL DEFAULT 3,
    "restDays" JSONB,
    "durationDays" INTEGER NOT NULL DEFAULT 28,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSession" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "completedAt" TIMESTAMP(3),
    "clientId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSessionNote" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "authorId" INTEGER,
    "role" TEXT NOT NULL,
    "text" TEXT,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanSessionNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSetLog" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "planSetId" INTEGER NOT NULL,
    "actualReps" INTEGER NOT NULL,
    "actualWeight" DOUBLE PRECISION,
    "rpe" DOUBLE PRECISION,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanSetLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_Plan_owner" ON "Plan"("ownerId");

-- CreateIndex
CREATE INDEX "idx_Plan_status" ON "Plan"("status");

-- CreateIndex
CREATE INDEX "idx_PlanDay_plan_order" ON "PlanDay"("planId", "order");

-- CreateIndex
CREATE INDEX "idx_PlanBlock_day_order" ON "PlanBlock"("dayId", "order");

-- CreateIndex
CREATE INDEX "idx_PlanBlockItem_block_order" ON "PlanBlockItem"("blockId", "order");

-- CreateIndex
CREATE INDEX "idx_PlanBlockItem_exercise" ON "PlanBlockItem"("exerciseId");

-- CreateIndex
CREATE INDEX "idx_PlanSet_item_order" ON "PlanSet"("itemId", "order");

-- CreateIndex
CREATE INDEX "idx_PlanAssignment_client" ON "PlanAssignment"("clientId");

-- CreateIndex
CREATE INDEX "idx_PlanAssignment_plan" ON "PlanAssignment"("planId");

-- CreateIndex
CREATE INDEX "idx_PlanSession_assignment" ON "PlanSession"("assignmentId");

-- CreateIndex
CREATE INDEX "idx_PlanSession_client_date" ON "PlanSession"("clientId", "date");

-- CreateIndex
CREATE INDEX "idx_PlanSessionNote_session" ON "PlanSessionNote"("sessionId");

-- CreateIndex
CREATE INDEX "idx_PlanSetLog_session" ON "PlanSetLog"("sessionId");

-- CreateIndex
CREATE INDEX "idx_PlanSetLog_set" ON "PlanSetLog"("planSetId");

-- AddForeignKey
ALTER TABLE "PlanDay" ADD CONSTRAINT "PlanDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBlock" ADD CONSTRAINT "PlanBlock_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "PlanDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBlockItem" ADD CONSTRAINT "PlanBlockItem_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "PlanBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanBlockItem" ADD CONSTRAINT "PlanBlockItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSet" ADD CONSTRAINT "PlanSet_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "PlanBlockItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanAssignment" ADD CONSTRAINT "PlanAssignment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSession" ADD CONSTRAINT "PlanSession_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "PlanAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSessionNote" ADD CONSTRAINT "PlanSessionNote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PlanSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSetLog" ADD CONSTRAINT "PlanSetLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PlanSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSetLog" ADD CONSTRAINT "PlanSetLog_planSetId_fkey" FOREIGN KEY ("planSetId") REFERENCES "PlanSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

