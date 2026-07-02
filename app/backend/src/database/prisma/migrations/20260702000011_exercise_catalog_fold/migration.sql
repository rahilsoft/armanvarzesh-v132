-- CreateEnum
CREATE TYPE "ExerciseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "ExerciseVideo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "audioUrl" TEXT,
    "description" TEXT,
    "level" TEXT,
    "kind" TEXT,
    "ownerId" INTEGER,
    "status" "ExerciseStatus" NOT NULL DEFAULT 'PENDING',
    "durationSec" INTEGER,
    "thumbnailUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentCatalog" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EquipmentCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muscle" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Muscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnatomyConfig" (
    "id" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,
    "modelUrl" TEXT NOT NULL,
    "meshMap" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnatomyConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExercisePrimaryMuscles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseSecondaryMuscles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseVideoToSport" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EquipmentCatalogToExerciseVideo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "idx_ExerciseVideo_status" ON "ExerciseVideo"("status");

-- CreateIndex
CREATE INDEX "idx_ExerciseVideo_owner" ON "ExerciseVideo"("ownerId");

-- CreateIndex
CREATE INDEX "idx_ExerciseVideo_title" ON "ExerciseVideo"("title");

-- CreateIndex
CREATE INDEX "idx_Sport_name" ON "Sport"("name");

-- CreateIndex
CREATE INDEX "idx_EquipmentCatalog_name" ON "EquipmentCatalog"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Muscle_code_key" ON "Muscle"("code");

-- CreateIndex
CREATE INDEX "idx_AnatomyConfig_gender_active" ON "AnatomyConfig"("gender", "active");

-- CreateIndex
CREATE UNIQUE INDEX "_ExercisePrimaryMuscles_AB_unique" ON "_ExercisePrimaryMuscles"("A", "B");

-- CreateIndex
CREATE INDEX "_ExercisePrimaryMuscles_B_index" ON "_ExercisePrimaryMuscles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseSecondaryMuscles_AB_unique" ON "_ExerciseSecondaryMuscles"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseSecondaryMuscles_B_index" ON "_ExerciseSecondaryMuscles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseVideoToSport_AB_unique" ON "_ExerciseVideoToSport"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseVideoToSport_B_index" ON "_ExerciseVideoToSport"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentCatalogToExerciseVideo_AB_unique" ON "_EquipmentCatalogToExerciseVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentCatalogToExerciseVideo_B_index" ON "_EquipmentCatalogToExerciseVideo"("B");

-- AddForeignKey
ALTER TABLE "_ExercisePrimaryMuscles" ADD CONSTRAINT "_ExercisePrimaryMuscles_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExercisePrimaryMuscles" ADD CONSTRAINT "_ExercisePrimaryMuscles_B_fkey" FOREIGN KEY ("B") REFERENCES "Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseSecondaryMuscles" ADD CONSTRAINT "_ExerciseSecondaryMuscles_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseSecondaryMuscles" ADD CONSTRAINT "_ExerciseSecondaryMuscles_B_fkey" FOREIGN KEY ("B") REFERENCES "Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseVideoToSport" ADD CONSTRAINT "_ExerciseVideoToSport_A_fkey" FOREIGN KEY ("A") REFERENCES "ExerciseVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseVideoToSport" ADD CONSTRAINT "_ExerciseVideoToSport_B_fkey" FOREIGN KEY ("B") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentCatalogToExerciseVideo" ADD CONSTRAINT "_EquipmentCatalogToExerciseVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "EquipmentCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentCatalogToExerciseVideo" ADD CONSTRAINT "_EquipmentCatalogToExerciseVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "ExerciseVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

