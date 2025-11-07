# Content Service - Migration Notes

## Schema Fixed (P0-1)

### Changes
- ✅ Added complete `generator client` and `datasource db` to schema.prisma
- ✅ Defined all 10 enums (ServiceType, ActivityLevel, BlockType, etc.)
- ✅ Implemented all 48 models with proper relations and indexes
- ✅ Created initial migration placeholder
- ✅ Updated seed.ts with meaningful test data

### Models Included (48 total)
**Specialist & Scoring:** SpecialistProfile, SpecialistMeta, SpecialistScore, SpecialistScoreHistory, ScoringWeights

**User & Leads:** UserMeta, UserProfile, Lead, ConversionEvent

**Chat:** ChatThread, ChatMessage

**Surveys:** SurveyTemplate, SurveyTask, SurveyResponse, SurveyInvite

**Nutrition:** Food, NutritionTemplate, NutritionPlan, MealLog

**Exercise & Plans:** ExerciseVideo, Sport, EquipmentCatalog, Muscle, AnatomyConfig, Plan, PlanDay, PlanBlock, PlanBlockItem, PlanSet, PlanAssignment, PlanSession, PlanSessionNote, PlanSetLog, CorrectiveProgress

**Corrective:** Condition, CorrectiveVideo, CorrectiveVideoCondition, ModerationLog

**CMS/Tiles:** Tile, TileVersion, PublishAudit

**Intake Forms:** IntakeForm, IntakeQuestion, IntakeResponse

**Infrastructure:** MediaJob, DeviceToken, NotificationTask, FeatureFlag

## Running Migrations

### Prerequisites
- PostgreSQL database running and accessible
- `DATABASE_URL` environment variable set
- Network access to Prisma binaries (for first-time setup)

### Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate Prisma Client:**
   ```bash
   pnpm prisma:generate
   # OR
   npx prisma generate
   ```

3. **Run migrations (development):**
   ```bash
   pnpm prisma:migrate:dev
   # OR
   npx prisma migrate dev
   ```

4. **Run migrations (production):**
   ```bash
   pnpm prisma:migrate:deploy
   # OR
   npx prisma migrate deploy
   ```

5. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

## Environment Variables

Required environment variables:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/content_db"
```

## Notes

- The initial migration placeholder was created in a restricted network environment
- Full SQL migration will be generated when `prisma migrate dev` is run in an environment with Prisma binary access
- All models have been validated against the codebase usage patterns
- Indexes have been optimized for common query patterns

## Testing

After running migrations, verify the schema:
```bash
npx prisma studio
```

This will open Prisma Studio for database inspection.

## Rollback

If you need to rollback the migration:
```bash
npx prisma migrate reset
```

⚠️ **Warning:** This will DROP all data in the database!

## Next Steps (as per P0 plan)

- [ ] P0-2: Deploy GraphQL Federation v2 gateway with entities
- [ ] P0-3: Implement JWT jti + blacklist + logout
- [ ] P0-4: Enforce HSTS + CSP + CORS with strict config
- [ ] P0-5: Implement chat persistence + Redis adapter
- [ ] P0-6: Deploy FCM push notifications end-to-end
- [ ] P0-7: Initialize Expo mobile apps with auth & Apollo
