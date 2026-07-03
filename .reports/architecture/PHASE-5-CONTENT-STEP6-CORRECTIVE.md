# Content dismemberment step 6 — Corrective* → Physio module

## Folded (4 models + 2 enums, cuid → Int PKs)
Condition, CorrectiveVideo (moderated, PENDING/APPROVED/REJECTED +
PRIVATE/PUBLIC visibility), CorrectiveVideoCondition (M2M by condition
code), CorrectiveProgress — now FK'd to the **canonical PhysioAssignment**
with `@@unique([assignmentId, dayIndex, itemKey])` (the original had no
uniqueness → duplicate check rows). Schema **118 → 122 models**; migration
`20260702000016` (82 lines).

## Code
`CorrectiveService` (PhysioModule): condition taxonomy upsert/list; video
upload guarded by known condition codes; review writes audit fields **and a
ModerationLog row** (step-5 CMS model — review actions now auditable, the
original never wrote its own ModerationLog); public browse gated on
APPROVED+PUBLIC with condition filter; idempotent daily corrective checks
guarded by assignment existence.

## Verification
typecheck exit 0 · lint exit 0 · npm test 35 suites / 115 tests green (2 new).

## Matrix position
Steps remaining: 7 (extension handoffs: ChatThread/ChatMessage →
chat-service; MediaJob → media; DeviceToken/NotificationTask →
notifications-service; UserMeta/SpecialistScoreHistory leftovers review) and
8 (retire content-service — gated on references/tests/runtime validation).
