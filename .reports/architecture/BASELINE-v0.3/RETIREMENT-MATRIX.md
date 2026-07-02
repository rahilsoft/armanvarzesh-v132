# Service retirement matrix — v0.3 baseline

Gate legend — a service is physically deleted only when **all four** gates pass:
**G1** logic folded & unit-tested · **G2** CI runtime validation (real Postgres)
· **G3** infra rewired (compose/k8s/gateway/prometheus no longer route to it)
· **G4** retirement commit (delete dir + lockfile).

| Service | Domain owner | G1 fold | G2 CI | G3 infra | G4 deleted | Blocking references |
|---|---|:---:|:---:|:---:|:---:|---|
| `auth-service` | monolith Auth | ✅ | ⏳ | ⏳ | — | `docker-compose.yml` (build + `AUTH_SERVICE_URL`), `k8s/svc-auth-service.yaml` + secret, `observability/prometheus.yml` |
| `users-service` | monolith Users | ✅ | ⏳ | ⏳ | — | gateway `USERS_URL` subgraph, compose `USERS_SERVICE_URL` |
| `payments-service` | monolith Payments | ✅ | ⏳ | ⏳ | — | none found in compose/gateway; verify k8s + monolith HTTP surface first (PAYMENTS-WIRE) |
| `ml-service` | — (stub) | n/a | n/a | ✅ (0 refs) | ✅ Phase 1 | — |
| `workouts-service` | monolith Workout | ⏳ next | | | | assess at fold time |
| `nutrition-service` | monolith Nutrition | queued | | | | |
| `booking-service` | monolith Booking | queued | | | | |
| `challenges-service` | monolith Gamification | queued | | | | |
| `rewards-service` | monolith Gamification | queued | | | | |
| `vip-service` | monolith Gamification | queued | | | | |
| `affiliate-service` | monolith Gamification | queued | | | | |
| `medical-service` | monolith Medical | queued | | | | |
| `physio-service` | monolith Physio | queued | | | | |
| `courses-service` | monolith Courses | queued | | | | |
| `certificate-service` | monolith Courses | queued | | | | |
| `assessments-service` | monolith Assessments | queued | | | | |
| `coaches-service` | monolith Profiles | queued | | | | |
| `marketplace-service` | monolith Orders | queued | | | | |
| `content-service` | multi-domain dismember | queued (matrix required per owner instruction) | | | | gateway `CONTENT_URL` subgraph |
| `inbox-service` | notifications-service | queued | | | | |
| `analytics-collector` | analytics-service | queued | | | | |
| `kpis-service` | analytics-service | queued | | | | |
| `api-gateway` | edge decision pending | — | | | | compose api-gateway block |
| `workers` | keep — needs real impl | — | | | | |

**Kept (extension layer, not retired):** ai-service, predictive-service,
notifications-service, chat-service, media-worker, analytics-service,
activities-service, monitoring-service, graphql-gateway, social/live/physio/
activity subgraphs (activity-subgraph loses its `Workout` dup at the Workout fold).

**Kept (deferred packages holding real logic):** `packages/auth` (frontend auth
ctx → Auth/frontend phase), `packages/integrations/livekit` (Live phase),
`packages/contracts` (gateway/infra stage).
