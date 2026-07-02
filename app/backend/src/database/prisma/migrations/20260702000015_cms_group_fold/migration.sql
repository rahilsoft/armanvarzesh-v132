-- CreateEnum
CREATE TYPE "TileState" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('OPEN', 'CONVERTED', 'CHURNED');

-- CreateTable
CREATE TABLE "Tile" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "variant" TEXT,
    "weight" DOUBLE PRECISION,
    "logicalId" TEXT,
    "state" "TileState" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TileVersion" (
    "id" SERIAL NOT NULL,
    "tileId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "state" "TileState" NOT NULL,
    "authorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishAudit" (
    "id" SERIAL NOT NULL,
    "tileId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" INTEGER,
    "fromState" "TileState",
    "toState" "TileState",
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyTemplate" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serviceType" "SpecialistType",
    "periodDays" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyTask" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "serviceType" "SpecialistType",
    "templateCode" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" SERIAL NOT NULL,
    "templateCode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyInvite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "templateCode" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeForm" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeQuestion" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "placeholder" TEXT,
    "options" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "section" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "validation" JSONB,

    CONSTRAINT "IntakeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeResponse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "formVersion" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "note" TEXT,
    "actorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "serviceType" "SpecialistType" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionEvent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "specialistId" INTEGER NOT NULL,
    "serviceType" "SpecialistType" NOT NULL,
    "kind" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_Tile_page_state_order" ON "Tile"("page", "state", "order");

-- CreateIndex
CREATE INDEX "idx_TileVersion_tile_version" ON "TileVersion"("tileId", "version");

-- CreateIndex
CREATE INDEX "idx_PublishAudit_tile" ON "PublishAudit"("tileId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyTemplate_code_key" ON "SurveyTemplate"("code");

-- CreateIndex
CREATE INDEX "idx_SurveyTask_user" ON "SurveyTask"("userId");

-- CreateIndex
CREATE INDEX "idx_SurveyTask_due" ON "SurveyTask"("dueAt");

-- CreateIndex
CREATE INDEX "idx_SurveyResponse_spec_code" ON "SurveyResponse"("specialistId", "templateCode");

-- CreateIndex
CREATE INDEX "idx_SurveyInvite_user_spec" ON "SurveyInvite"("userId", "specialistId");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeForm_slug_key" ON "IntakeForm"("slug");

-- CreateIndex
CREATE INDEX "idx_IntakeQuestion_form_order" ON "IntakeQuestion"("formId", "order");

-- CreateIndex
CREATE INDEX "idx_IntakeResponse_user" ON "IntakeResponse"("userId");

-- CreateIndex
CREATE INDEX "idx_ModerationLog_entity" ON "ModerationLog"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE INDEX "idx_Lead_spec_service" ON "Lead"("specialistId", "serviceType");

-- CreateIndex
CREATE INDEX "idx_Lead_user" ON "Lead"("userId");

-- CreateIndex
CREATE INDEX "idx_Conversion_spec_service" ON "ConversionEvent"("specialistId", "serviceType");

-- AddForeignKey
ALTER TABLE "TileVersion" ADD CONSTRAINT "TileVersion_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishAudit" ADD CONSTRAINT "PublishAudit_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeQuestion" ADD CONSTRAINT "IntakeQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "IntakeForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeResponse" ADD CONSTRAINT "IntakeResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "IntakeForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

