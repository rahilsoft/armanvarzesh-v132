# content-service ownership matrix — dismemberment phase 1 (mandated pre-deletion analysis)

Per the owner's 7-step safe process. 48 models classified below; `usedBy` =
number of content-service source files touching the model via its Prisma
client (0 ⇒ candidate **Dead** pending API/resolver cross-check).

| Model | Target owner (approved map) | Overlaps canonical model | usedBy | Class |
|---|---|---|---|---|
| SpecialistProfile | Profiles | Specialist | 1 | Duplicate/Merge |
| SpecialistMeta | Profiles | — | 1 | Canonical (unique) |
| SpecialistScore | Profiles | SpecialistRating | 2 | Duplicate/Merge |
| SpecialistScoreHistory | Profiles | — | 1 | Canonical (unique) |
| ScoringWeights | Profiles | — | 2 | Canonical (unique) |
| UserMeta | Users | — | 1 | Canonical (unique) |
| UserProfile | Users | User | 1 | Duplicate/Merge |
| Lead | CRM/Marketing | — | 5 | Canonical (unique) |
| ConversionEvent | CRM/Marketing | — | 3 | Canonical (unique) |
| ChatThread | Chat (extension svc) | — | 2 | Shared → extension svc |
| ChatMessage | Chat (extension svc) | Message (monolith) / chat-service | 2 | Duplicate/Merge |
| SurveyTemplate | CMS/Surveys | — | 2 | Canonical (unique) |
| SurveyTask | CMS/Surveys | — | 1 | Canonical (unique) |
| SurveyResponse | CMS/Surveys | — | 3 | Canonical (unique) |
| SurveyInvite | CMS/Surveys | — | 1 | Canonical (unique) |
| Food | Nutrition | Food | 2 | Duplicate/Merge |
| NutritionTemplate | Nutrition | — | 1 | Canonical (unique) |
| NutritionPlan | Nutrition | — | 2 | Canonical (unique) |
| MealLog | Nutrition | MealLog | 1 | Duplicate/Merge |
| ExerciseVideo | Workout/Media | — | 3 | Canonical (unique) |
| Sport | Workout | — | 1 | Canonical (unique) |
| EquipmentCatalog | Workout | — | 1 | Canonical (unique) |
| Muscle | Workout | — | 1 | Canonical (unique) |
| AnatomyConfig | Workout | — | 1 | Canonical (unique) |
| Plan | Workout | — | 3 | Canonical (unique) |
| PlanDay | Workout | — | 2 | Canonical (unique) |
| PlanBlock | Workout | — | 2 | Canonical (unique) |
| PlanBlockItem | Workout | — | 2 | Canonical (unique) |
| PlanSet | Workout | — | 2 | Canonical (unique) |
| PlanAssignment | Workout | — | 1 | Canonical (unique) |
| PlanSession | Workout | — | 1 | Canonical (unique) |
| PlanSessionNote | Workout | — | 1 | Canonical (unique) |
| PlanSetLog | Workout | — | 1 | Canonical (unique) |
| CorrectiveProgress | Physio | — | 1 | Canonical (unique) |
| Condition | Physio | — | 1 | Canonical (unique) |
| CorrectiveVideo | Physio | — | 2 | Canonical (unique) |
| CorrectiveVideoCondition | Physio | — | 1 | Canonical (unique) |
| ModerationLog | CMS/Moderation | — | 0 | Dead? |
| Tile | CMS | — | 2 | Canonical (unique) |
| TileVersion | CMS | — | 1 | Canonical (unique) |
| PublishAudit | CMS | — | 2 | Canonical (unique) |
| IntakeForm | CMS/Intake | — | 1 | Canonical (unique) |
| IntakeQuestion | CMS/Intake | — | 1 | Canonical (unique) |
| IntakeResponse | CMS/Intake | — | 1 | Canonical (unique) |
| MediaJob | Media (extension svc) | — | 2 | Shared → extension svc |
| DeviceToken | Notifications (extension svc) | — | 2 | Shared → extension svc |
| NotificationTask | Notifications (extension svc) | — | 0 | Dead? |
| FeatureFlag | Platform/Config | — | 1 | Canonical (unique) |

## Non-model artifacts
- Controllers: 3 route decorators
- Resolver files: 26
- Queue/cron job files: 4

## Execution order (subsequent cycles)
1. Workout Plan* engine (14 models) -> monolith Workout module
2. Nutrition overlap (Food/NutritionTemplate/NutritionPlan/MealLog) -> merge with canonical
3. Profiles Specialist* (5) -> merge with canonical Specialist
4. CMS (Tile/Survey/Intake/Moderation, 11) -> monolith CMS module
5. Physio Corrective* (4) -> monolith Physio module
6. Extension handoffs: ChatThread/ChatMessage -> chat-service; MediaJob -> media;
   DeviceToken/NotificationTask -> notifications-service
7. Leads/ConversionEvent (CRM) + FeatureFlag (platform) -> owner-visible decision if kept
8. Retire content-service after references, tests and runtime validation pass.
