# Phase 4 — Step 20: Async scan report

Patterns scanned:
- forEach(async ...)
- map(async ...)
- Promise.then chains (manual review)
- explicit `void fn()` usage (intentional fire-and-forget)

## forEach_async (0)
- none
## map_async (0)
- none
## then_chain (19)
- apps/coach-app/utils/signed-upload.ts
- apps/user-app/screens/BarcodeScannerScreen.tsx
- apps/user-app/utils/signed-upload.ts
- apps/vitrin-site/app/admin/experiments/page.tsx
- apps/vitrin-site/app/admin/forms/preview/page.tsx
- apps/vitrin-site/app/anatomy/page.tsx
- apps/vitrin-site/components/SignedImage.tsx
- apps/vitrin-site/components/TileCard.tsx
- apps/vitrin-site/lib/flags.tsx
- apps/vitrin-site/pages/admin/live-events/[id]/analytics.tsx
- apps/vitrin-site/pages/vod/[room].tsx
- apps/vitrin-site/pages/vod/index.tsx
- apps/vitrin-site/src/hooks/useAuth.ts
- apps/vitrin-site/src/hooks/useFetch.ts
- apps/vitrin-site/src/hooks/useNotification.ts
- apps/vitrin-site/src/hooks/useWorkout.ts
- services/api-gateway/src/main.js
- services/auth-service/src/main.js
- services/content-service/src/tracing.ts
## void_promise (0)
- none
