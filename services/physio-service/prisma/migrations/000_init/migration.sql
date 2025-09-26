-- Initial tables for physio domain (PostgreSQL)
CREATE TABLE IF NOT EXISTS "PhysioProtocol" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "area" TEXT NOT NULL,
  "weeks" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "PhysioStep" (
  "id" TEXT PRIMARY KEY,
  "week" INT NOT NULL,
  "day" INT NOT NULL,
  "exerciseId" TEXT NOT NULL,
  "notes" TEXT,
  "seconds" INT,
  "videoUrl" TEXT,
  "protocolId" TEXT NOT NULL REFERENCES "PhysioProtocol"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PhysioAssignment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "protocolId" TEXT NOT NULL,
  "startedAt" TIMESTAMP NOT NULL,
  "archivedAt" TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "PhysioSession" (
  "id" TEXT PRIMARY KEY,
  "assignmentId" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT FALSE,
  "completedAt" TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "PainLog" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "score" INT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "RomMeasure" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "joint" TEXT NOT NULL,
  "side" TEXT NOT NULL,
  "angle" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
