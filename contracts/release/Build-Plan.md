# Dry Build Plan (Stage 45)

- **Total packages**: 74
- **Buildable**: 74
- **Non-Buildable**: 0
- **Cycles detected**: 15 (@arman/storage, @arman/service-kit, @arman/awards-engine, @arman/ui, @arman/http-client, @arman/state, @arman/async-utils, @arman/integration, @arman/env-config, @arman/integrations-livekit, @arman/ui-components, @arman/observability, @arman/training-load-engine, @arman/utils, @arman/ui-tokens)

## Order (Topological, internal workspace deps)
1. @arman/contracts
2. challenges-service
3. @arman/assessments-service
4. vip-service
5. @arman/integrations
6. notifications-service
7. @arman/graphql-utils
8. @arman/resilience
9. @arman/theme
10. @arman/auth
11. @arman/graphql-dataloader
12. nutrition-service
13. courses-service
14. @arman/libs
15. @arman/rewards-service
16. affiliate-service
17. vitrin-site
18. armanfit-admin
19. @arman/contracts-tests
20. @arman/booking-service
21. @arman/analytics-service
22. armanfit-coach
23. @arman/coach-pwa
24. payments-service
25. marketplace-service
26. @arman/client-live
27. content-service
28. ai-service
29. @arman/infra
30. @arman/web-core
31. api-gateway
32. chat-service
33. @arman/live-subgraph
34. @arman/user-pwa
35. @arman/workers
36. @arman/physio-service
37. predictive-service
38. reward-service
39. @arman/analytics-collector
40. @arman/backend
41. @arman/shared
42. auth-service
43. monitoring-service
44. @arman/auth-kit
45. @arman/ui-kit-live
46. bullmq-worker
47. @arman/activity-subgraph
48. armanfit-user
49. armanvarzesh-monorepo
50. @arman/certificate-service
51. workouts-service
52. @arman/social-subgraph
53. @arman/graphql
54. @arman/media-worker
55. assessment-service
56. coaches-service
57. users-service
58. @arman/cache-std

## Buildable Packages
- @arman/contracts at `packages/contracts` — fw: Nest — build: `tsc -p tsconfig.json || echo "no tsc"` — dist: dist/
- challenges-service at `services/challenges-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/assessments-service at `services/assessments-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- vip-service at `services/vip-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/integrations at `packages/integrations` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- notifications-service at `services/notifications-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/graphql-utils at `packages/graphql-utils` — fw: Node/Pure — build: `tsc -p tsconfig.json || echo "no tsc"` — dist: dist/
- @arman/resilience at `packages/resilience` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/theme at `packages/theme` — fw: Node/Pure — build: `echo "No TypeScript in package"` — dist: dist/
- @arman/auth at `packages/auth` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/graphql-dataloader at `packages/graphql-dataloader` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- nutrition-service at `services/nutrition-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- courses-service at `services/courses-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/libs at `packages/libs` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/rewards-service at `services/rewards-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- affiliate-service at `services/affiliate-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- vitrin-site at `apps/vitrin-site` — fw: Nest — build: `next build` — dist: dist/
- armanfit-admin at `apps/armanfit-admin` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/contracts-tests at `packages/contracts-tests` — fw: Node/Pure — build: `tsc -p tsconfig.json || echo "no tsc"` — dist: dist/
- @arman/booking-service at `services/booking-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/analytics-service at `services/analytics-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- armanfit-coach at `apps/coach-app` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/coach-pwa at `apps/coach-pwa` — fw: React — build: `tsc -b && vite build` — dist: UNKNOWN
- payments-service at `services/payments-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- marketplace-service at `services/marketplace-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/client-live at `packages/client-live` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- content-service at `services/content-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- ai-service at `services/ai-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/infra at `packages/infra` — fw: Node/Pure — build: `tsc -p tsconfig.json || echo "no tsc"` — dist: dist/
- @arman/web-core at `packages/web-core` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- api-gateway at `services/api-gateway` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- chat-service at `services/chat-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/live-subgraph at `apps/live-subgraph` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/user-pwa at `apps/user-pwa` — fw: React — build: `tsc -b && vite build` — dist: UNKNOWN
- @arman/workers at `services/workers` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/physio-service at `services/physio-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- predictive-service at `services/predictive-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- reward-service at `services/reward-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/analytics-collector at `services/analytics-collector` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/backend at `apps/backend` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/shared at `packages/shared` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- auth-service at `services/auth-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- monitoring-service at `services/monitoring-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/auth-kit at `packages/auth-kit` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/ui-kit-live at `packages/ui-kit-live` — fw: React — build: `tsc -p tsconfig.json` — dist: UNKNOWN
- bullmq-worker at `services/workers/bullmq-worker` — fw: Node/Pure — build: `echo "No TypeScript in package"` — dist: dist/
- @arman/activity-subgraph at `apps/activity-subgraph` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- armanfit-user at `apps/user-app` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- armanvarzesh-monorepo at `.` — fw: Node/Pure — build: `pnpm -r --if-present run build` — dist: dist/
- @arman/certificate-service at `services/certificate-service` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- workouts-service at `services/workouts-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/social-subgraph at `apps/social-subgraph` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/graphql at `packages/graphql` — fw: Node/Pure — build: `echo "No TypeScript in package"` — dist: dist/
- @arman/media-worker at `apps/media-worker` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/media-worker at `services/media-worker` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- assessment-service at `services/assessment-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- coaches-service at `services/coaches-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- users-service at `services/users-service` — fw: Nest — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/cache-std at `packages/cache-std` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/ui at `packages/ui` — fw: React — build: `tsc -p tsconfig.build.json` — dist: UNKNOWN
- @arman/awards-engine at `packages/awards-engine` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/env-config at `packages/env-config` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/ui-components at `packages/ui-components` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/integration at `packages/integration` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/utils at `packages/utils` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/observability at `packages/observability` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/state at `packages/state` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/storage at `packages/storage` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/integrations-livekit at `packages/integrations/livekit` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/async-utils at `packages/async-utils` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/http-client at `packages/http-client` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/service-kit at `packages/service-kit` — fw: Node/Pure — build: `tsc -p tsconfig.build.json` — dist: dist/
- @arman/ui-tokens at `packages/ui-tokens` — fw: Nest — build: `tsc -p tsconfig.json` — dist: dist/
- @arman/training-load-engine at `packages/training-load-engine` — fw: Node/Pure — build: `tsc -p tsconfig.json` — dist: dist/

## Non-Buildable Packages
_—_
