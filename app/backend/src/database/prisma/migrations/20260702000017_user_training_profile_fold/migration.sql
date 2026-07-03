-- CreateTable
CREATE TABLE "UserTrainingProfile" (
    "userId" INTEGER NOT NULL,
    "trainingEnv" TEXT,
    "equipment" JSONB,
    "injuries" JSONB,
    "measurements" JSONB,
    "medical" JSONB,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTrainingProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserTrainingProfile" ADD CONSTRAINT "UserTrainingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

