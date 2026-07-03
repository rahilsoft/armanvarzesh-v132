-- CreateEnum
CREATE TYPE "HabitType" AS ENUM ('water', 'steps', 'training', 'calorie');

-- CreateTable
CREATE TABLE "NutritionGoal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HydrationLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "occurredAt" TIMESTAMPTZ(6) NOT NULL,
    "ml" INTEGER NOT NULL,
    "source" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HydrationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "HabitType" NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "cadence" JSONB NOT NULL,
    "tz" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitLog" (
    "id" SERIAL NOT NULL,
    "habitId" INTEGER NOT NULL,
    "occurredAt" TIMESTAMPTZ(6) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionGoal_userId_key" ON "NutritionGoal"("userId");

-- CreateIndex
CREATE INDEX "idx_NutritionGoal_userId" ON "NutritionGoal"("userId");

-- CreateIndex
CREATE INDEX "idx_HydrationLog_userId_occurredAt" ON "HydrationLog"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "idx_HydrationLog_occurredAt" ON "HydrationLog"("occurredAt");

-- CreateIndex
CREATE INDEX "idx_Habit_user_type" ON "Habit"("userId", "type");

-- CreateIndex
CREATE INDEX "idx_Habit_active" ON "Habit"("active");

-- CreateIndex
CREATE INDEX "idx_HabitLog_habit_occurredAt" ON "HabitLog"("habitId", "occurredAt");

-- CreateIndex
CREATE INDEX "idx_HabitLog_occurredAt" ON "HabitLog"("occurredAt");

-- AddForeignKey
ALTER TABLE "NutritionGoal" ADD CONSTRAINT "NutritionGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HydrationLog" ADD CONSTRAINT "HydrationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

