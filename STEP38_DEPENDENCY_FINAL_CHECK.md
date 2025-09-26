# Phase 6 — Step 38: Final Dependency Review & Stabilization

این مرحله با هدف **پایدارسازی نسخه‌ها** و پیشگیری از خطاهای CI (به‌خصوص PNPM/Codemagic) انجام شد.

## تغییرات کلیدی

- root: engines.node => >=20
- root: packageManager => pnpm@9.6.0
- root: pnpm.overrides.@nestjs/passport => 11.0.5
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/activity-subgraph: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/armanfit-admin: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/backend: pin @nestjs/passport 11.0.5 in dependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/backend: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/coach-app: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/live-subgraph: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/media-worker: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/social-subgraph: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/user-app: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/apps/vitrin-site: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/auth-kit: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/awards-engine: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/cache-std: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/client-live: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/contracts: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/contracts-tests: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/env-config: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/graphql-dataloader: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/graphql-utils: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/infra: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/integration: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/integrations/livekit: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/observability: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/resilience: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/service-kit: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/shared: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/storage: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/training-load-engine: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/ui-components: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/ui-kit-live: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/packages/ui-tokens: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/affiliate-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/ai-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/analytics-collector: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/assessment-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/auth-service: pin @nestjs/passport 11.0.5 in dependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/challenges-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/chat-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/coaches-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/content-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/courses-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/marketplace-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/media-worker: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/monitoring-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/notifications-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/nutrition-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/payments-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/predictive-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/reward-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/users-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/vip-service: pin typescript ^5.6.2 in devDependencies
- /mnt/data/review2_phase6_step38_20250822_083221/armanvarzesh_v57/services/workouts-service: pin typescript ^5.6.2 in devDependencies

## توضیحات
- با `pnpm.overrides` در **ریشه**، نسخهٔ TypeScript و `@nestjs/passport` در کل workspace یکسان می‌ماند.
- `engines.node >= 20` و `packageManager=pnpm@9.6.0` باعث سازگاری با رنرهای CI و Corepack می‌شود.
- اگر وابستگی‌های دیگری نیاز به pin دارند (مثل GraphQL 17 با Nest 11)، پیشنهاد می‌شود در یک شاخهٔ جدا مهاجرت انجام شود تا **ریسک شکست بیلد** کاهش یابد.
