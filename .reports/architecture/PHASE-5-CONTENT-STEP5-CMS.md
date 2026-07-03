# Content dismemberment step 5 — CMS group → CMS module

## Folded (15 models + 2 enums, cuid → Int PKs)
Tile/TileVersion/PublishAudit (+TileState), SurveyTemplate/Task/Response/
Invite, IntakeForm/Question/Response, ModerationLog, FeatureFlag,
Lead/ConversionEvent (+LeadStatus). Survey* keyed on the canonical
SpecialistType (content's ServiceType merged in step 4). Schema
**104 → 118 models**; migration `20260702000015` (262 lines).

## Code
`CmsTilesService` (CmsModule — which was another unwired dead module, now
wired into app.module): tile upsert with **version snapshot + publish-audit
row on every mutation**, publish workflow with from/to state audit, public
page render (published-only, ordered), tile history; intake form lifecycle
(create → activate bumps version → submit requires active + records form
version); feature flags upsert/read; CRM leads + conversions
(FREE_TO_PREMIUM closes the open lead — feeds the step-4 scoring metric
sources); survey responses.

## Verification
typecheck exit 0 · lint exit 0 · npm test 34 suites / 113 tests green (3 new).
