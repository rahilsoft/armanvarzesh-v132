# Content dismemberment step 7 — final folds + extension handoffs

## Folded
- `UserTrainingProfile` (canonical, 1:1 User): content's UserProfile+UserMeta
  merged (trainingEnv/equipment/injuries/measurements/medical + free-form
  meta). heightCm/weightKg NOT ported — duplicates of canonical
  User.height/weight. Schema **122 → 123 models**; migration
  `20260702000017` (18 lines).
- Notifications handoff: `DeviceToken` + `NotificationTask` added to
  **services/notifications-service** schema (kept extension service; String
  cuid ids per the extension-layer PK decision); its client regenerated.

## Classified, no port (Duplicates of extension-service canonicals)
- ChatThread/ChatMessage → chat-service (owns Thread/Message/ChatMessage).
- MediaJob → media-worker/media-service.

## Matrix closure
All 48 content-service models are now dispositioned (steps 1–7).
`services/content-service/DEPRECATED.md` carries the full destination table.
Step 8 (physical retirement) is **CONTENT-RETIRE** — gated on gateway
`CONTENT_URL` rewire + CI runtime validation, per the standing rule.

## Verification
typecheck exit 0 (backend; notifications-service has no typecheck script —
CI `--if-present` skips it, client regenerated cleanly) · lint exit 0 ·
npm test 35 suites / 115 tests green.
