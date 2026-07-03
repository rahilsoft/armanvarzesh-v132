# ⚠️ DEPRECATED — dismembered per the committed ownership matrix

All 48 models of this mega-service have been dispositioned per
`.reports/architecture/CONTENT-SERVICE-OWNERSHIP-MATRIX.md` across
dismemberment steps 1–7 (commits `bebdee0`, `cccccc7`, `d0d8a5e`, `24e374f`,
`513e6bd`, `71ec33d`, and the step-7 commit):

| Destination | Models |
|---|---|
| Workout (monolith) | ExerciseVideo, Sport, EquipmentCatalog, Muscle→MuscleRef, AnatomyConfig, Plan, PlanDay, PlanBlock, PlanBlockItem, PlanSet, PlanAssignment, PlanSession, PlanSessionNote, PlanSetLog |
| Nutrition (monolith) | NutritionTemplate, NutritionPlan, Food (merged), MealLog→NutritionPlanMealLog |
| Profiles (monolith) | SpecialistProfile+SpecialistMeta (merged into Specialist), SpecialistScore, SpecialistScoreHistory, ScoringWeights |
| CMS (monolith) | Tile, TileVersion, PublishAudit, SurveyTemplate, SurveyTask, SurveyResponse, SurveyInvite, IntakeForm, IntakeQuestion, IntakeResponse, ModerationLog, FeatureFlag, Lead, ConversionEvent |
| Physio (monolith) | CorrectiveProgress, Condition, CorrectiveVideo, CorrectiveVideoCondition |
| Users (monolith) | UserProfile+UserMeta → UserTrainingProfile (height/weight NOT ported — duplicates of User.height/weight) |
| Notifications (extension svc) | DeviceToken, NotificationTask (schema handoff landed in services/notifications-service) |
| Chat (extension svc) | ChatThread, ChatMessage — **Duplicates** of chat-service's Thread/ChatMessage; canonical is chat-service; no port |
| Media (extension svc) | MediaJob — canonical job model belongs to media-worker/media-service; the monolith's media queue already enqueues via BullMQ |

## Why this service is not yet deleted
Retirement (step 8) is gated on the standing rule: all references
(gateway `CONTENT_URL` subgraph, compose/k8s), tests and runtime validation
against real Postgres must pass first (**CONTENT-RETIRE** in the retirement
matrix). Do not add new features here.
