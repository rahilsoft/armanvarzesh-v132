-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "planId" INTEGER,
ADD COLUMN     "reps" INTEGER,
ADD COLUMN     "rpe" DOUBLE PRECISION,
ADD COLUMN     "sets" INTEGER,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "data" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER,
    "reps" INTEGER,
    "weight" DOUBLE PRECISION,
    "rpe" DOUBLE PRECISION,
    "restTime" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_WorkoutPlan_userId" ON "WorkoutPlan"("userId");

-- CreateIndex
CREATE INDEX "idx_Exercise_planId" ON "Exercise"("planId");

-- CreateIndex
CREATE INDEX "idx_Workout_planId" ON "Workout"("planId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

