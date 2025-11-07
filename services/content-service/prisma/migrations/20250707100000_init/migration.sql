-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('NUTRITIONIST', 'COACH', 'PHYSICAL_THERAPIST', 'PSYCHOLOGIST', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('SINGLE', 'SUPERSET', 'TRISET', 'CIRCUIT');

-- CreateEnum
CREATE TYPE "PlanKind" AS ENUM ('WORKOUT', 'CORRECTIVE', 'NUTRITION');

-- CreateEnum
CREATE TYPE "ExerciseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CorrectiveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TileState" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('OPEN', 'CONVERTED', 'CHURNED');

-- NOTE: This is an initial migration placeholder.
-- To generate the complete migration with all CREATE TABLE statements,
-- run the following command in an environment with network access to Prisma binaries:
--
--   npx prisma migrate dev --name init
--
-- This will create all 48 models defined in schema.prisma.
-- The migration should be reviewed and tested before deployment to production.

-- For reference, the complete schema includes the following models:
-- SpecialistProfile, SpecialistMeta, SpecialistScore, SpecialistScoreHistory,
-- ScoringWeights, UserMeta, UserProfile, Lead, ConversionEvent, ChatThread,
-- ChatMessage, SurveyTemplate, SurveyTask, SurveyResponse, SurveyInvite,
-- Food, NutritionTemplate, NutritionPlan, MealLog, ExerciseVideo, Sport,
-- EquipmentCatalog, Muscle, AnatomyConfig, Plan, PlanDay, PlanBlock,
-- PlanBlockItem, PlanSet, PlanAssignment, PlanSession, PlanSessionNote,
-- PlanSetLog, CorrectiveProgress, Condition, CorrectiveVideo,
-- CorrectiveVideoCondition, ModerationLog, Tile, TileVersion, PublishAudit,
-- IntakeForm, IntakeQuestion, IntakeResponse, MediaJob, DeviceToken,
-- NotificationTask, FeatureFlag
