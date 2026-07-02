-- CreateTable
CREATE TABLE "PhysioProtocol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysioProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysioStep" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "exerciseId" INTEGER,
    "notes" TEXT,
    "seconds" INTEGER,
    "videoUrl" TEXT,
    "protocolId" INTEGER NOT NULL,

    CONSTRAINT "PhysioStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysioAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "protocolId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "PhysioAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysioSession" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PhysioSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainLog" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PainLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RomMeasure" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "joint" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "angle" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RomMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_PhysioStep_protocol_week_day" ON "PhysioStep"("protocolId", "week", "day");

-- CreateIndex
CREATE INDEX "idx_PhysioAssignment_user_active" ON "PhysioAssignment"("userId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhysioSession_assignmentId_date_key" ON "PhysioSession"("assignmentId", "date");

-- CreateIndex
CREATE INDEX "idx_PainLog_session_time" ON "PainLog"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_RomMeasure_user_time" ON "RomMeasure"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "PhysioStep" ADD CONSTRAINT "PhysioStep_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "PhysioProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysioAssignment" ADD CONSTRAINT "PhysioAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysioSession" ADD CONSTRAINT "PhysioSession_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "PhysioAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainLog" ADD CONSTRAINT "PainLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PhysioSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RomMeasure" ADD CONSTRAINT "RomMeasure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

