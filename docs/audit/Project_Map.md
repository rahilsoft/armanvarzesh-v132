# Project Map

## Repo Root
- Detected repo root: `/mnt/data/workdir/armanvarzesh v21`

## Tree (trimmed)
```
├── .github/
│   ├── actions/
│   │   └── setup-node-pnpm/
│   │       └── action.yml
│   ├── workflows/
│   │   ├── backend-ci.yml
│   │   ├── ci-unified.yml
│   │   ├── ci.yml
│   │   ├── codeql.yml
│   │   ├── common-node-pnpm.yaml
│   │   ├── contracts.yml
│   │   ├── lighthouse.yml
│   │   ├── migrations.yml
│   │   ├── monorepo-turbo.yml
│   │   ├── openapi-export.yml
│   │   ├── preview-env.yml
│   │   ├── publish-ghcr.yml
│   │   ├── release.yml
│   │   ├── reusable-node-pnpm.yml
│   │   ├── sbom.yml
│   │   ├── security-trivy-images.yml
│   │   ├── security-trivy.yml
│   │   └── security.yml
│   └── dependabot.yml
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── app/
│   ├── armanfit-admin/
│   │   ├── .storybook/
│   │   │   ├── main.ts
│   │   │   └── preview.ts
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   │   └── Yekan.ttf
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   ├── src/
│   │   │   ├── apollo/
│   │   │   │   └── client.ts
│   │   │   ├── assets/
│   │   │   │   ├── icons/
│   │   │   │   │   ├── admin.png
│   │   │   │   │   ├── coach.png
│   │   │   │   │   ├── marketplace.png
│   │   │   │   │   ├── notification.png
│   │   │   │   │   ├── nutrition.png
│   │   │   │   │   ├── payment.png
│   │   │   │   │   ├── user.png
│   │   │   │   │   ├── wallet.png
│   │   │   │   │   └── workout.png
│   │   │   │   └── images/
│   │   │   │       └── admin-bg.png
│   │   │   ├── components/
│   │   │   │   ├── Admin/
│   │   │   │   │   └── AdminTable.tsx
│   │   │   │   ├── Analytics/
│   │   │   │   │   └── AnalyticsCharts.tsx
│   │   │   │   ├── Challenge/
│   │   │   │   │   ├── ChallengeForm.tsx
│   │   │   │   │   └── ChallengeTable.tsx
│   │   │   │   ├── Coach/
│   │   │   │   │   ├── CoachForm.tsx
│   │   │   │   │   └── CoachTable.tsx
│   │   │   │   ├── Common/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── DataTable.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Loader.tsx
│   │   │   │   │   └── Modal.tsx
│   │   │   │   ├── common/
│   │   │   │   │   ├── EmptyState.tsx
│   │   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   │   └── Loading.tsx
│   │   │   │   ├── forms/
│   │   │   │   │   └── FormText.tsx
│   │   │   │   ├── Layout/
│   │   │   │   │   ├── AdminFooter.tsx
│   │   │   │   │   ├── AdminHeader.tsx
│   │   │   │   │   └── AdminSidebar.tsx
│   │   │   │   ├── Marketplace/
│   │   │   │   │   └── ProductTable.tsx
│   │   │   │   ├── Notification/
│   │   │   │   │   └── NotificationTable.tsx
│   │   │   │   ├── Nutrition/
│   │   │   │   │   ├── NutritionPlanForm.tsx
│   │   │   │   │   └── NutritionPlanTable.tsx
│   │   │   │   ├── Payment/
│   │   │   │   │   ├── PaymentForm.tsx
│   │   │   │   │   └── PaymentTable.tsx
│   │   │   │   ├── Reward/
│   │   │   │   │   └── RewardTable.tsx
│   │   │   │   ├── Survey/
│   │   │   │   │   └── SurveyTable.tsx
│   │   │   │   ├── User/
│   │   │   │   │   ├── UserForm.tsx
│   │   │   │   │   └── UserTable.tsx
│   │   │   │   ├── Wallet/
│   │   │   │   │   └── WalletTable.tsx
│   │   │   │   ├── Workout/
│   │   │   │   │   ├── WorkoutForm.tsx
│   │   │   │   │   └── WorkoutTable.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── context/
│   │   │   │   ├── AdminContext.tsx
│   │   │   │   └── AuthContext.tsx
│   │   │   ├── graphql/
│   │   │   │   ├── mutations/
│   │   │   │   │   ├── admin.mutations.ts
│   │   │   │   │   ├── analytics.mutations.ts
│   │   │   │   │   ├── challenge.mutations.ts
│   │   │   │   │   ├── coach.mutations.ts
│   │   │   │   │   ├── notification.mutations.ts
│   │   │   │   │   ├── nutrition.mutations.ts
│   │   │   │   │   ├── payment.mutations.ts
│   │   │   │   │   ├── product.mutations.ts
│   │   │   │   │   ├── reward.mutations.ts
│   │   │   │   │   ├── survey.mutations.ts
│   │   │   │   │   ├── user.mutations.ts
│   │   │   │   │   ├── wallet.mutations.ts
│   │   │   │   │   └── workout.mutations.ts
│   │   │   │   └── queries/
│   │   │   │       ├── admin.queries.ts
│   │   │   │       ├── analytics.queries.ts
│   │   │   │       ├── challenge.queries.ts
│   │   │   │       ├── coach.queries.ts
│   │   │   │       ├── notification.queries.ts
│   │   │   │       ├── nutrition.queries.ts
│   │   │   │       ├── payment.queries.ts
│   │   │   │       ├── product.queries.ts
│   │   │   │       ├── reward.queries.ts
│   │   │   │       ├── survey.queries.ts
│   │   │   │       ├── user.queries.ts
│   │   │   │       ├── wallet.queries.ts
│   │   │   │       └── workout.queries.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAdmin.ts
│   │   │   │   ├── useAnalytics.ts
│   │   │   │   ├── useChallenge.ts
│   │   │   │   ├── useCoach.ts
│   │   │   │   ├── useNotification.ts
│   │   │   │   ├── useNutrition.ts
│   │   │   │   ├── usePayment.ts
│   │   │   │   ├── useProduct.ts
│   │   │   │   ├── useReward.ts
│   │   │   │   ├── useSurvey.ts
│   │   │   │   ├── useUser.ts
│   │   │   │   ├── useWallet.ts
│   │   │   │   └── useWorkout.ts
│   │   │   ├── pages/
│   │   │   │   ├── Admins/
│   │   │   │   │   ├── AdminDetailPage.tsx
│   │   │   │   │   └── AdminListPage.tsx
│   │   │   │   ├── Challenges/
│   │   │   │   │   ├── ChallengeDetailPage.tsx
│   │   │   │   │   └── ChallengeListPage.tsx
│   │   │   │   ├── Coaches/
│   │   │   │   │   ├── CoachDetailPage.tsx
│   │   │   │   │   └── CoachListPage.tsx
│   │   │   │   ├── Marketplace/
│   │   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   │   └── ProductListPage.tsx
│   │   │   │   ├── Nutrition/
│   │   │   │   │   ├── NutritionPlanDetailPage.tsx
│   │   │   │   │   └── NutritionPlanListPage.tsx
│   │   │   │   ├── Payments/
│   │   │   │   │   ├── PaymentDetailPage.tsx
│   │   │   │   │   └── PaymentListPage.tsx
│   │   │   │   ├── Users/
│   │   │   │   │   ├── UserDetailPage.tsx
│   │   │   │   │   └── UserListPage.tsx
│   │   │   │   ├── Workouts/
│   │   │   │   │   ├── WorkoutDetailPage.tsx
│   │   │   │   │   └── WorkoutListPage.tsx
│   │   │   │   ├── AnalyticsPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── FormDemo.tsx
│   │   │   │   ├── LeaderboardPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── NotFound.tsx
│   │   │   │   ├── NotificationsPage.tsx
│   │   │   │   ├── RewardsPage.tsx
│   │   │   │   ├── SettingsPage.tsx
│   │   │   │   ├── SurveyPage.tsx
│   │   │   │   ├── UIDemo.tsx
│   │   │   │   └── WalletPage.tsx
│   │   │   ├── routes/
│   │   │   │   ├── adminRoutes.ts
│   │   │   │   └── PrivateRoute.tsx
│   │   │   ├── styles/
│   │   │   │   └── global.css
│   │   │   ├── theme/
│   │   │   │   ├── colors.ts
│   │   │   │   ├── spacing.ts
│   │   │   │   └── typography.ts
│   │   │   ├── utils/
│   │   │   │   ├── api.ts
│   │   │   │   ├── constants.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── permissions.ts
│   │   │   │   └── validators.ts
│   │   │   ├── App.tsx
│   │   │   └── index.tsx
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   ├── backend/
│   │   ├── auth/
│   │   │   └── auth.service.ts
│   │   ├── scripts/
│   │   │   ├── .env.example
│   │   │   ├── docker-compose.yml
│   │   │   ├── Dockerfile
│   │   │   ├── generate-schema.ts
│   │   │   ├── migrate.sh
│   │   │   ├── README.md
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── admin/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── admin.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── admin.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── admin.entity.ts
│   │   │   │   ├── admin.module.ts
│   │   │   │   ├── admin.resolver.ts
│   │   │   │   └── admin.service.ts
│   │   │   ├── ai/
│   │   │   │   ├── dto/
│   │   │   │   │   └── ai.input.ts
│   │   │   │   ├── engines/
│   │   │   │   │   └── workout-engine.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── ai.entity.ts
│   │   │   │   ├── ai.module.ts
│   │   │   │   ├── ai.resolver.ts
│   │   │   │   └── ai.service.ts
│   │   │   ├── analytics/
│   │   │   │   ├── dto/
│   │   │   │   │   └── analytics.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── analytics.entity.ts
│   │   │   │   ├── reports/
│   │   │   │   │   └── kpi.report.ts
│   │   │   │   ├── abTesting.service.ts
│   │   │   │   ├── analytics.module.ts
│   │   │   │   ├── analytics.resolver.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── clickTracking.middleware.ts
│   │   │   ├── auth/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── login.input.ts
│   │   │   │   │   ├── register.input.ts
│   │   │   │   │   └── reset-password.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── auth.entity.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   └── otp.guard.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.resolver.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── challenges/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── challenges.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── challenge.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── challenge.entity.ts
│   │   │   │   ├── challenges.module.ts
│   │   │   │   ├── challenges.resolver.ts
│   │   │   │   └── challenges.service.ts
│   │   │   ├── chat/
│   │   │   │   ├── dto/
│   │   │   │   │   └── message.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── message.entity.ts
│   │   │   │   ├── chat.module.ts
│   │   │   │   ├── chat.resolver.ts
│   │   │   │   └── chat.service.ts
│   │   │   ├── cms/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── cms.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── cms.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── cms.entity.ts
│   │   │   │   ├── cms.module.ts
│   │   │   │   ├── cms.resolver.ts
│   │   │   │   └── cms.service.ts
│   │   │   ├── coaches/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── coaches.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── create-coach.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── coach.entity.ts
│   │   │   │   ├── coaches.module.ts
│   │   │   │   ├── coaches.resolver.ts
│   │   │   │   └── coaches.service.ts
│   │   │   ├── common/
│   │   │   │   ├── constants/
│   │   │   │   │   ├── app.constants.ts
│   │   │   │   │   └── roles.constants.ts
│   │   │   │   ├── decorators/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   ├── ratelimit.guard.ts
│   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   └── subscription.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── audit.interceptor.ts
│   │   │   │   │   ├── logging.interceptor.ts
│   │   │   │   │   └── transform.interceptor.ts
│   │   │   │   ├── pipes/
│   │   │   │   │   ├── trim.pipe.ts
│   │   │   │   │   └── validation.pipe.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── auditlog.service.ts
│   │   │   │   │   ├── hashing.service.ts
│   │   │   │   │   ├── kavenegar-sms.service.ts
│   │   │   │   │   ├── token.service.ts
│   │   │   │   │   └── zarinpal.service.ts
│   │   │   │   └── utils/
│   │   │   │       ├── hash.util.ts
│   │   │   │       └── helpers.ts
│   │   │   ├── config/
│   │   │   │   ├── configuration.ts
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── corporate/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── corporate.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── corporate.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── corporate.entity.ts
│   │   │   │   ├── corporate.module.ts
│   │   │   │   ├── corporate.resolver.ts
│   │   │   │   └── corporate.service.ts
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   │   └── 001_init_schema.sql
│   │   │   │   ├── prisma/
│   │   │   │   │   ├── migrations/
│   │   │   │   │   │   ├── 20250812132426_add_core_indexes/
│   │   │   │   │   │   └── 20250812132821_hot_indexes_workout_payment_notification/
│   │   │   │   │   ├── MIGRATIONS_README.md
│   │   │   │   │   └── schema.prisma
│   │   │   │   ├── seeds/
│   │   │   │   │   └── seed_users.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── dto/
│   │   │   │   └── payment.input.ts
│   │   │   ├── experiments/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── experiments.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── experiment.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── experiment.entity.ts
│   │   │   │   ├── experiments.module.ts
│   │   │   │   ├── experiments.resolver.ts
│   │   │   │   └── experiments.service.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── leaderboard/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── leaderboard.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── leaderboard.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── leaderboard.entity.ts
│   │   │   │   ├── leaderboard.module.ts
│   │   │   │   ├── leaderboard.resolver.ts
│   │   │   │   └── leaderboard.service.ts
│   │   │   ├── live/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── live.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── live.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── live.entity.ts
│   │   │   │   ├── live.module.ts
│   │   │   │   ├── live.resolver.ts
│   │   │   │   └── live.service.ts
│   │   │   ├── live-session/
│   │   │   │   ├── aiFeedback.processor.ts
│   │   │   │   └── websocket.gateway.ts
│   │   │   ├── marketplace/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── marketplace.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── marketplace.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── marketplace.entity.ts
│   │   │   │   ├── marketplace.module.ts
│   │   │   │   ├── marketplace.resolver.ts
│   │   │   │   └── marketplace.service.ts
│   │   │   ├── ml/
│   │   │   │   └── poseEstimator.service.ts
│   │   │   ├── notification/
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── reminder.service.ts
│   │   │   ├── notifications/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── notifications.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── notification.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── notification.entity.ts
│   │   │   │   ├── notifications.module.ts
│   │   │   │   ├── notifications.resolver.ts
│   │   │   │   └── notifications.service.ts
│   │   │   ├── nutrition/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── nutrition.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── create-meal.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── meal.entity.ts
│   │   │   │   ├── nutrition.module.ts
│   │   │   │   ├── nutrition.resolver.ts
│   │   │   │   └── nutrition.service.ts
│   │   │   ├── payments/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── payments.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── payment.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── payment.entity.ts
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.resolver.ts
│   │   │   │   └── payments.service.ts
│   │   │   ├── payroll/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── payroll.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── payroll.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── payroll.entity.ts
│   │   │   │   ├── payroll.module.ts
│   │   │   │   ├── payroll.resolver.ts
│   │   │   │   └── payroll.service.ts
│   │   │   ├── reservations/
│   │   │   │   ├── reservation.entity.ts
│   │   │   │   └── reservation.service.ts
│   │   │   ├── resolver/
│   │   │   │   └── payment.resolver.ts
│   │   │   ├── scheduler/
│   │   │   │   └── sessionReminder.job.ts
│   │   │   ├── security/
│   │   │   │   ├── audit/
│   │   │   │   │   ├── audit.interceptor.ts
│   │   │   │   │   └── auditlog.entity.ts
│   │   │   │   ├── controllers/
│   │   │   │   │   └── security.controller.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── multisig.guard.ts
│   │   │   │   │   └── security.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── security.interceptor.ts
│   │   │   │   ├── logs/
│   │   │   │   │   └── tamperprooflog.entity.ts
│   │   │   │   ├── security.module.ts
│   │   │   │   └── security.service.ts
│   │   │   ├── service/
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── zarinpal.service.ts
│   │   │   ├── support/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── support.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── support.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── support.entity.ts
│   │   │   │   ├── support.module.ts
│   │   │   │   ├── support.resolver.ts
│   │   │   │   └── support.service.ts
│   │   │   ├── survey/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── survey.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── survey.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── survey.entity.ts
│   │   │   │   ├── survey.module.ts
│   │   │   │   ├── survey.resolver.ts
│   │   │   │   └── survey.service.ts
│   │   │   ├── user/
│   │   │   │   └── user.service.ts
│   │   │   ├── users/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── users.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-user.input.ts
│   │   │   │   │   └── update-user.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.resolver.ts
│   │   │   │   └── users.service.ts
│   │   │   ├── wallet/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── wallet.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   └── wallet.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── wallet.entity.ts
│   │   │   │   ├── wallet.module.ts
│   │   │   │   ├── wallet.resolver.ts
│   │   │   │   └── wallet.service.ts
│   │   │   ├── workouts/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── workouts.controller.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-workout.input.ts
│   │   │   │   │   └── update-workout.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── workout.entity.ts
│   │   │   │   ├── workouts.module.ts
│   │   │   │   ├── workouts.resolver.ts
│   │   │   │   └── workouts.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── dataloader.ts
│   │   ├── test/
│   │   │   ├── e2e/
│   │   │   │   ├── app.e2e-spec.ts
│   │   │   │   ├── auth.e2e-spec.ts
│   │   │   │   ├── notifications.e2e-spec.ts
│   │   │   │   └── workouts.e2e-spec.ts
│   │   │   ├── mocks/
│   │   │   │   ├── user.mock.ts
│   │   │   │   └── workout.mock.ts
│   │   │   ├── unit/
│   │   │   │   ├── auth.service.spec.ts
│   │   │   │   ├── payment.service.spec.ts
│   │   │   │   ├── user.service.spec.ts
│   │   │   │   ├── users.service.spec.ts
│   │   │   │   └── workouts.service.spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── users/
│   │   │   └── users.service.ts
│   │   ├── workouts/
│   │   │   └── workouts.service.ts
│   │   ├── .env.example
│   │   ├── app.gateway.ts
│   │   ├── app.module.ts
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── main.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── coach-app/
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   │   └── Yekan.ttf
│   │   │   ├── icons/
│   │   │   │   ├── app-icon.png
│   │   │   │   ├── client.png
│   │   │   │   ├── dashboard.png
│   │   │   │   ├── plan.png
│   │   │   │   ├── profile.png
│   │   │   │   └── workout.png
│   │   │   └── images/
│   │   │       ├── bg-dashboard.png
│   │   │       ├── client-header.png
│   │   │       └── splash.png
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── Clients/
│   │   │   │   ├── ClientCard.tsx
│   │   │   │   └── ClientList.tsx
│   │   │   ├── Common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── NotificationItem.tsx
│   │   │   │   ├── PaymentCard.tsx
│   │   │   │   └── RewardCard.tsx
│   │   │   ├── Nutrition/
│   │   │   │   └── AdviceCard.tsx
│   │   │   ├── PlanBuilder/
│   │   │   │   ├── PlanCard.tsx
│   │   │   │   └── PlanList.tsx
│   │   │   └── Workouts/
│   │   │       └── WorkoutReviewCard.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── CoachContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── graphql/
│   │   │   ├── mutations/
│   │   │   │   ├── auth.mutations.ts
│   │   │   │   ├── client.mutations.ts
│   │   │   │   ├── notification.mutations.ts
│   │   │   │   ├── plan.mutations.ts
│   │   │   │   └── workout.mutations.ts
│   │   │   ├── queries/
│   │   │   │   ├── auth.queries.ts
│   │   │   │   ├── client.queries.ts
│   │   │   │   ├── coach.queries.ts
│   │   │   │   ├── notification.queries.ts
│   │   │   │   ├── payment.queries.ts
│   │   │   │   ├── plan.queries.ts
│   │   │   │   └── workout.queries.ts
│   │   │   └── client.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useClients.ts
│   │   │   ├── useCoach.ts
│   │   │   ├── useNotification.ts
│   │   │   ├── usePayment.ts
│   │   │   ├── usePlans.ts
│   │   │   └── useWorkout.ts
│   │   ├── navigation/
│   │   │   ├── AuthStack.tsx
│   │   │   ├── MainTabNavigator.tsx
│   │   │   ├── RootNavigator.tsx
│   │   │   └── types.ts
│   │   ├── screens/
│   │   │   ├── AdminContactScreen.tsx
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   ├── ChallengeManagementScreen.tsx
│   │   │   ├── ClientDetailScreen.tsx
│   │   │   ├── ClientListScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── LiveSessionManageScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── MarketplaceScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   ├── NutritionAdviceScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   ├── PlanBuilderScreen.tsx
│   │   │   ├── PlanDetailScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── RewardsScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── SupportScreen.tsx
│   │   │   ├── SurveyScreen.tsx
│   │   │   └── WorkoutApproveScreen.tsx
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── context/
│   │   │   │   └── ThemeContext.ts
│   │   │   ├── screens/
│   │   │   │   ├── EmptyScreen.tsx
│   │   │   │   ├── ErrorScreen.tsx
│   │   │   │   └── LoadingScreen.tsx
│   │   │   └── AppNavigator.ts
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── app.json
│   │   ├── App.tsx
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   ├── user-app/
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   │   └── Yekan.ttf
│   │   │   ├── icons/
│   │   │   │   ├── app-icon.png
│   │   │   │   ├── home.png
│   │   │   │   ├── leaderboard.png
│   │   │   │   ├── nutrition.png
│   │   │   │   ├── user.png
│   │   │   │   └── workout.png
│   │   │   └── images/
│   │   │       ├── bg-home.png
│   │   │       ├── splash.png
│   │   │       └── workout-header.png
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── Common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── ChallengeCard.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── LeaderboardItem.tsx
│   │   │   │   ├── LiveVideoPlayer.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── NotificationItem.tsx
│   │   │   │   ├── PaymentCard.tsx
│   │   │   │   ├── SurveyCard.tsx
│   │   │   │   └── WalletCard.tsx
│   │   │   ├── Nutrition/
│   │   │   │   ├── MealCard.tsx
│   │   │   │   └── NutritionStats.tsx
│   │   │   └── Workouts/
│   │   │       ├── WorkoutCard.tsx
│   │   │       └── WorkoutList.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── UserContext.tsx
│   │   ├── graphql/
│   │   │   ├── mutations/
│   │   │   │   ├── auth.mutations.ts
│   │   │   │   ├── notification.mutations.ts
│   │   │   │   ├── nutrition.mutations.ts
│   │   │   │   ├── payment.mutations.ts
│   │   │   │   └── workout.mutations.ts
│   │   │   ├── queries/
│   │   │   │   ├── ai.queries.ts
│   │   │   │   ├── auth.queries.ts
│   │   │   │   ├── challenge.queries.ts
│   │   │   │   ├── leaderboard.queries.ts
│   │   │   │   ├── notification.queries.ts
│   │   │   │   ├── nutrition.queries.ts
│   │   │   │   ├── payment.queries.ts
│   │   │   │   ├── user.queries.ts
│   │   │   │   ├── wallet.queries.ts
│   │   │   │   └── workout.queries.ts
│   │   │   └── client.ts
│   │   ├── hooks/
│   │   │   ├── useAiCoach.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useChallenge.ts
│   │   │   ├── useLeaderboard.ts
│   │   │   ├── useNotification.ts
│   │   │   ├── useNutrition.ts
│   │   │   ├── usePayment.ts
│   │   │   ├── useWallet.ts
│   │   │   └── useWorkout.ts
│   │   ├── navigation/
│   │   │   ├── AuthStack.tsx
│   │   │   ├── MainTabNavigator.tsx
│   │   │   ├── RootNavigator.tsx
│   │   │   └── types.ts
│   │   ├── screens/
│   │   │   ├── AdminContactScreen.tsx
│   │   │   ├── AiCoachScreen.tsx
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   ├── ChallengeDetailScreen.tsx
│   │   │   ├── ChallengeListScreen.tsx
│   │   │   ├── CreateWorkoutScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── LeaderboardScreen.tsx
│   │   │   ├── LiveSessionScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── MarketplaceScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   ├── NutritionDetailScreen.tsx
│   │   │   ├── NutritionScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── RewardsScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── SupportScreen.tsx
│   │   │   ├── SurveyScreen.tsx
│   │   │   ├── WalletScreen.tsx
│   │   │   ├── WorkoutDetailScreen.tsx
│   │   │   └── WorkoutListScreen.tsx
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── context/
│   │   │   │   └── ThemeContext.ts
│   │   │   ├── screens/
│   │   │   │   ├── EmptyScreen.tsx
│   │   │   │   ├── ErrorScreen.tsx
│   │   │   │   └── LoadingScreen.tsx
│   │   │   └── AppNavigator.ts
│   │   ├── theme/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   ├── permissions.ts
│   │   │   └── validators.ts
│   │   ├── app.json
│   │   ├── App.tsx
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   └── vitrin-site/
│       ├── .storybook/
│       │   ├── main.ts
│       │   ├── preview.ts
│       │   └── ui-components.stories.tsx
│       ├── components/
│       │   ├── Button.stories.tsx
│       │   ├── EmptyState.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── Loading.tsx
│       │   ├── SmartImage.tsx
│       │   └── ThemeToggle.tsx
│       ├── pages/
│       │   ├── 404.tsx
│       │   ├── _app.tsx
│       │   ├── _document.tsx
│       │   ├── _error.tsx
│       │   └── ui-demo.tsx
│       ├── public/
│       │   ├── assets/
│       │   │   └── icons/
│       │   │       └── logo.png
│       │   ├── fonts/
│       │   │   └── Yekan.ttf
│       │   ├── manifest.json
│       │   └── robots.txt
│       ├── src/
│       │   ├── components/
│       │   │   ├── academy/
│       │   │   │   ├── LevelProgressBar.tsx
│       │   │   │   ├── LevelUpgradeCriteria.tsx
│       │   │   │   └── TrainerLevelDisplay.tsx
│       │   │   ├── achievements/
│       │   │   │   ├── BadgeCard.tsx
│       │   │   │   ├── BadgeGrid.tsx
│       │   │   │   └── XpProgressBar.tsx
│       │   │   ├── affiliate/
│       │   │   │   ├── AffiliateDashboard.tsx
│       │   │   │   ├── CommissionCard.tsx
│       │   │   │   ├── PayoutRequest.tsx
│       │   │   │   ├── ReferralHistoryTable.tsx
│       │   │   │   ├── ReferralInvite.tsx
│       │   │   │   ├── ReferralLinkBox.tsx
│       │   │   │   ├── ReferralStats.tsx
│       │   │   │   └── ReferralTransactionsTable.tsx
│       │   │   ├── badge/
│       │   │   │   ├── AchievementCard.tsx
│       │   │   │   ├── BadgeList.tsx
│       │   │   │   └── XpProgressBar.tsx
│       │   │   ├── certificate/
│       │   │   │   ├── CertificateCard.tsx
│       │   │   │   ├── CertificateDesign.tsx
│       │   │   │   ├── CertificateQrPreview.tsx
│       │   │   │   ├── CertificateVerifyPage.tsx
│       │   │   │   ├── CoachCertificate.tsx
│       │   │   │   └── QRGenerator.tsx
│       │   │   ├── coach/
│       │   │   │   ├── academy/
│       │   │   │   │   ├── CertificateList.tsx
│       │   │   │   │   ├── TrainerBadge.tsx
│       │   │   │   │   ├── TrainerLevelCard.tsx
│       │   │   │   │   ├── TrainerStatusOverview.tsx
│       │   │   │   │   └── UpgradeRequirements.tsx
│       │   │   │   ├── analytics/
│       │   │   │   │   ├── AiWarningBanner.tsx
│       │   │   │   │   ├── ClientProgressCard.tsx
│       │   │   │   │   ├── KpiOverview.tsx
│       │   │   │   │   ├── PerformanceChart.tsx
│       │   │   │   │   └── SessionReportTable.tsx
│       │   │   │   ├── certificates/
│       │   │   │   │   ├── CertificateCard.tsx
│       │   │   │   │   ├── CertificateDownload.tsx
│       │   │   │   │   └── QrCodeDisplay.tsx
│       │   │   │   └── courses/
│       │   │   │       ├── CourseForm.tsx
│       │   │   │       ├── LectureUploader.tsx
│       │   │   │       ├── PreviewPanel.tsx
│       │   │   │       └── SectionManager.tsx
│       │   │   ├── coach-profile/
│       │   │   │   ├── CoachBioSection.tsx
│       │   │   │   ├── CoachCoursesList.tsx
│       │   │   │   ├── CoachProfilePage.tsx
│       │   │   │   └── CoachReviewPanel.tsx
│       │   │   ├── kpi/
│       │   │   │   ├── KpiComparisonCard.tsx
│       │   │   │   ├── KpiGraph.tsx
│       │   │   │   └── KpiOverview.tsx
│       │   │   ├── match/
│       │   │   │   ├── CoachMatchPage.tsx
│       │   │   │   ├── MatchCoachCard.tsx
│       │   │   │   └── MatchExplanation.tsx
│       │   │   ├── shop/
│       │   │   │   └── ProductCard.tsx
│       │   │   ├── system/
│       │   │   │   ├── AffiliateDashboard.tsx
│       │   │   │   ├── CoachLevelTag.tsx
│       │   │   │   ├── LoadingXP.tsx
│       │   │   │   ├── ReferralInviteCard.tsx
│       │   │   │   └── VerifiedCoach.tsx
│       │   │   ├── vip/
│       │   │   │   ├── BadgeList.tsx
│       │   │   │   ├── LevelProgress.tsx
│       │   │   │   ├── LoyaltyProgress.tsx
│       │   │   │   ├── SubscriptionRenewal.tsx
│       │   │   │   ├── VipBenefits.tsx
│       │   │   │   ├── VipBenefitsList.tsx
│       │   │   │   ├── VIPDashboard.tsx
│       │   │   │   ├── VipStatusCard.tsx
│       │   │   │   └── VipTierCard.tsx
│       │   │   ├── CoachCard.tsx
│       │   │   ├── CoachCard_2.tsx
│       │   │   ├── FeatureTile.tsx
│       │   │   ├── FeatureTile_2.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── Footer_2.tsx
│       │   │   ├── Header.tsx
│       │   │   ├── Header_2.tsx
│       │   │   ├── HeroSection.tsx
│       │   │   ├── HeroSection_2.tsx
│       │   │   ├── PlanCard.tsx
│       │   │   ├── PlanCard_2.tsx
│       │   │   ├── ProductCard.tsx
│       │   │   └── ProductCard_2.tsx
│       │   ├── constants/
│       │   │   ├── config.ts
│       │   │   ├── roles.ts
│       │   │   ├── routes.ts
│       │   │   └── strings.ts
│       │   ├── graphql/
│       │   │   ├── mutations.ts
│       │   │   ├── queries.ts
│       │   │   └── subscriptions.ts
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useFetch.ts
│       │   │   ├── useForm.ts
│       │   │   ├── useNotification.ts
│       │   │   └── useWorkout.ts
│       │   ├── lib/
│       │   │   └── qr/
│       │   │       └── generator.ts
│       │   ├── pages/
│       │   │   ├── achievements/
│       │   │   │   └── UserAchievements.tsx
│       │   │   ├── affiliate/
│       │   │   │   ├── AffiliateDashboard.tsx
│       │   │   │   └── Dashboard.tsx
│       │   │   ├── coach/
│       │   │   │   ├── academy/
│       │   │   │   │   ├── TrainerAcademy.tsx
│       │   │   │   │   └── UpgradeLevel.tsx
│       │   │   │   ├── analytics/
│       │   │   │   │   └── CoachDashboard.tsx
│       │   │   │   ├── certificates/
│       │   │   │   │   └── CertificatePage.tsx
│       │   │   │   └── courses/
│       │   │   │       └── CourseBuilder.tsx
│       │   │   ├── shop/
│       │   │   │   ├── CartPage.tsx
│       │   │   │   ├── CheckoutPage.tsx
│       │   │   │   ├── ProductDetailPage.tsx
│       │   │   │   └── ShopPage.tsx
│       │   │   ├── vip/
│       │   │   │   ├── VipClubPage.tsx
│       │   │   │   └── VipDashboard.tsx
│       │   │   ├── AboutPage.tsx
│       │   │   ├── AuthPage.tsx
│       │   │   ├── BlogPage.tsx
│       │   │   ├── CartPage.tsx
│       │   │   ├── CheckoutPage.tsx
│       │   │   ├── CoachesLandingPage.tsx
│       │   │   ├── ContactPage.tsx
│       │   │   ├── FAQPage.tsx
│       │   │   ├── HomePage.tsx
│       │   │   ├── NutritionLandingPage.tsx
│       │   │   ├── OrdersPage.tsx
│       │   │   ├── PostDetailPage.tsx
│       │   │   ├── PrivacyPage.tsx
│       │   │   ├── ProductDetailPage.tsx
│       │   │   ├── ProfilePage.tsx
│       │   │   ├── ServicesLandingPage.tsx
│       │   │   ├── ShopPage.tsx
│       │   │   ├── SuccessPage.tsx
│       │   │   ├── SupportPage.tsx
│       │   │   ├── TermsPage.tsx
│       │   │   ├── VIPClubPage.tsx
│       │   │   └── WalletPage.tsx
│       │   ├── styles/
│       │   │   ├── globals.css
│       │   │   ├── tailwind.config.js
│       │   │   └── variables.css
│       │   └── utils/
│       │       ├── api.ts
│       │       ├── constants.ts
│       │       ├── formatters.ts
│       │       ├── helpers.ts
│       │       └── validators.ts
│       ├── styles/
│       │   └── globals.css
│       ├── lighthouserc.json
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
├── devops/
│   ├── docker/
│   │   ├── .env.example
│   │   ├── Dockerfile.admin-panel
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── Dockerfile.mobile
│   ├── github-actions/
│   │   ├── ci-admin-panel.yml
│   │   ├── ci-backend.yml
│   │   ├── ci-coverage.yml
│   │   ├── ci-frontend.yml
│   │   └── ci-mobile.yml
│   ├── kubernetes/
│   │   ├── admin-panel-deployment.yaml
│   │   ├── admin-panel-service.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── backend-service.yaml
│   │   ├── configmap.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── frontend-service.yaml
│   │   ├── ingress.yaml
│   │   ├── mobile-deployment.yaml
│   │   ├── mobile-service.yaml
│   │   └── secrets.yaml
│   ├── legacy/
│   │   └── docker-compose.full.yml
│   └── scripts/
│       ├── backup-db.sh
│       ├── build.sh
│       ├── deploy.sh
│       ├── migrate-db.sh
│       └── setup-env.sh
├── docs/
│   ├── operations/
│   │   └── runbook.md
│   ├── architecture.md
│   ├── ci-cd.md
│   ├── env-matrix.md
│   ├── HARDENING-NOTES.md
│   ├── README.md
│   ├── runbook.md
│   └── testing.md
├── documentation/
│   ├── API/
│   │   ├── auth.md
│   │   ├── coach.md
│   │   ├── notification.md
│   │   ├── nutrition.md
│   │   ├── payment.md
│   │   ├── user.md
│   │   └── workout.md
│   ├── Architecture/
│   │   ├── api-design.md
│   │   ├── database-schema.md
│   │   └── system-architecture.md
│   ├── DevOps/
│   │   ├── ci-cd.md
│   │   ├── docker.md
│   │   └── kubernetes.md
│   ├── UI-UX/
│   │   ├── design-guidelines.md
│   │   ├── figma-assets.md
│   │   ├── final-checklist.md
│   │   ├── next-steps.md
│   │   └── phase3.md
│   └── FAQ.md
├── e2e/
│   ├── auth_workout_notification.e2e.ts
│   ├── helpers.ts
│   ├── jest-e2e.config.js
│   └── smoke.spec.ts
├── helm/
│   ├── armanfit/
│   │   ├── templates/
│   │   │   ├── deployment.yaml
│   │   │   ├── external-secret.yaml
│   │   │   ├── hpa.yaml
│   │   │   ├── networkpolicy.yaml
│   │   │   └── secret-env.yaml
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   ├── armanfit-admin/
│   │   ├── templates/
│   │   │   ├── deployment.yaml
│   │   │   ├── external-secret.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── secret-env.yaml
│   │   │   └── service.yaml
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   ├── armanfit-backend/
│   │   ├── templates/
│   │   │   ├── _helpers.tpl
│   │   │   ├── deployment.yaml
│   │   │   ├── external-secret.yaml
│   │   │   ├── externalsecret.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── secret-env.yaml
│   │   │   ├── secret.yaml
│   │   │   └── service.yaml
│   │   ├── Chart.yaml
│   │   ├── values.production.yaml
│   │   └── values.yaml
│   ├── armanfit-mobile/
│   │   ├── templates/
│   │   │   ├── deployment.yaml
│   │   │   ├── external-secret.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── secret-env.yaml
│   │   │   └── service.yaml
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   ├── infra/
│   │   └── secretstore.example.yaml
│   └── users-service/
│       ├── templates/
│       │   ├── _helpers.tpl
│       │   ├── deployment.yaml
│       │   ├── external-secret.yaml
│       │   ├── secret-env.yaml
│       │   └── service.yaml
│       ├── Chart.yaml
│       └── values.yaml
├── infra/
│   └── terraform/
│       └── base/
│           ├── main.tf
│           └── versions.tf
├── k8s/
│   ├── canary/
│   │   └── ingress-canary-example.yaml
│   ├── 00-namespace.yaml
│   ├── 10-configmap.yaml
│   ├── 11-secrets.yaml
│   ├── backend-deployment.yaml
│   ├── backend-ingress.yaml
│   ├── svc-affiliate-service.yaml
│   ├── svc-ai-service.yaml
│   ├── svc-assessment-service.yaml
│   ├── svc-auth-service.yaml
│   ├── svc-challenges-service.yaml
│   ├── svc-chat-service.yaml
│   ├── svc-coaches-service.yaml
│   ├── svc-content-service.yaml
│   ├── svc-courses-service.yaml
│   ├── svc-marketplace-service.yaml
│   ├── svc-monitoring-service.yaml
│   ├── svc-notifications-service.yaml
│   ├── svc-nutrition-service.yaml
│   ├── svc-payments-service.yaml
│   ├── svc-predictive-service.yaml
│   ├── svc-reward-service.yaml
│   ├── svc-users-service.yaml
│   ├── svc-vip-service.yaml
│   ├── svc-workouts-service.yaml
│   ├── users-deployment.yaml
│   └── users-service.yaml
├── migrations/
│   └── 001_init_users.sql
├── observability/
│   ├── grafana/
│   │   └── provisioning/
│   │       ├── dashboards/
│   │       │   └── overview.json
│   │       └── datasources/
│   │           └── datasources.yml
│   ├── loki-config.yml
│   ├── otel-collector-config.yml
│   ├── prometheus.yml
│   └── tempo-config.yml
├── packages/
│   ├── contracts/
│   │   ├── tests/
│   │   │   └── sample-consumer.mjs
│   │   └── package.json
│   ├── observability/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── shared/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   │   ├── dto/
│   │   │   │   │   └── pagination.dto.ts
│   │   │   │   ├── filters/
│   │   │   │   │   └── http-exception.filter.ts
│   │   │   │   └── interceptors/
│   │   │   │       ├── logging.interceptor.ts
│   │   │   │       └── transform.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.module.ts
│   │   │   │   └── env.schema.ts
│   │   │   ├── infra/
│   │   │   │   └── health.indicators.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui-components/
│   │   ├── src/
│   │   │   └── index.tsx
│   │   ├── styles/
│   │   │   └── components.css
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui-tokens/
│       ├── src/
│       │   └── index.ts
│       ├── styles/
│       │   └── tokens.css
│       ├── package.json
│       └── tsconfig.json
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── instagram.png
│   │   │   ├── logo.png
│   │   │   └── telegram.png
│   │   └── images/
│   │       ├── belt.jpg
│   │       ├── coach1.jpg
│   │       ├── coach2.jpg
│   │       ├── coach3.jpg
│   │       ├── strap.jpg
│   │       └── whey.jpg
│   ├── fonts/
│   │   └── Yekan.ttf
│   ├── mnt/
│   │   └── data/
│   │       └── armanvarzesh/
│   │           └── armanvarzesh/
│   │               └── helm/
│   │                   └── armanfit-admin/
│   ├── public/
│   │   └── logo.png
│   ├── (.*)
│   ├── coach-avatar.jpg
│   ├── favicon.ico
│   ├── manifest.json
│   ├── seal.png
│   └── signature.png
├── scripts/
│   ├── e2e-run.sh
│   ├── migrate-all.sh
│   └── migrate-deploy-all.sh
├── seeds/
│   └── seed.js
├── services/
│   ├── affiliate-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── affiliate/
│   │   │   │   ├── affiliate.module.ts
│   │   │   │   ├── affiliate.resolver.ts
│   │   │   │   └── affiliate.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── affiliateresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── ai-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── ai/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── nutrition-recommendation.entity.ts
│   │   │   │   │   └── workout-recommendation.entity.ts
│   │   │   │   ├── ai.module.ts
│   │   │   │   ├── ai.resolver.ts
│   │   │   │   └── ai.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── airesolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── assessment-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── assessment/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-test.input.ts
│   │   │   │   │   ├── record-result.input.ts
│   │   │   │   │   └── update-test.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── test-result.entity.ts
│   │   │   │   │   └── test.entity.ts
│   │   │   │   ├── assessment.module.ts
│   │   │   │   ├── assessment.resolver.ts
│   │   │   │   └── assessment.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── assessmentresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── auth-service/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   └── .keep
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── login.input.ts
│   │   │   │   │   ├── refresh.input.ts
│   │   │   │   │   └── register.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── auth-tokens.entity.ts
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.dto.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.resolver.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.guard.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── password-reset.controller.ts
│   │   │   │   ├── password-reset.service.ts
│   │   │   │   ├── totp.controller.ts
│   │   │   │   └── totp.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   ├── prisma-middleware.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── jwt-keys.service.ts
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── auth.spec.ts
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── auth.flow.e2e-spec.ts
│   │   │       ├── authresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── challenges-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── challenges/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── add-points.input.ts
│   │   │   │   │   ├── create-challenge.input.ts
│   │   │   │   │   └── join-challenge.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── challenge-entry.entity.ts
│   │   │   │   │   └── challenge.entity.ts
│   │   │   │   ├── challenges.module.ts
│   │   │   │   ├── challenges.resolver.ts
│   │   │   │   └── challenges.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── challengesresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── chat-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── chat/
│   │   │   │   ├── chat.module.ts
│   │   │   │   ├── chat.resolver.ts
│   │   │   │   └── chat.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── chat.service.spec.ts
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── chatresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.js
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── coaches-service/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   └── .keep
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── coaches/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-coach.input.ts
│   │   │   │   │   └── update-coach.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── coach.entity.ts
│   │   │   │   ├── coaches.module.ts
│   │   │   │   ├── coaches.resolver.ts
│   │   │   │   └── coaches.service.ts
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   ├── prisma-middleware.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── coachesresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── content-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── content/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-content.input.ts
│   │   │   │   │   └── update-content.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── content.entity.ts
│   │   │   │   ├── content.module.ts
│   │   │   │   ├── content.resolver.ts
│   │   │   │   └── content.service.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── contentresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── courses-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── courses/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-course.input.ts
│   │   │   │   │   ├── enroll.input.ts
│   │   │   │   │   ├── schedule-session.input.ts
│   │   │   │   │   └── update-course.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── course.entity.ts
│   │   │   │   │   ├── enrollment.entity.ts
│   │   │   │   │   └── session.entity.ts
│   │   │   │   ├── courses.module.ts
│   │   │   │   ├── courses.resolver.ts
│   │   │   │   └── courses.service.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── coursesresolver.gql-e2e-spec.ts
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── marketplace-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── marketplace/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-item.input.ts
│   │   │   │   │   ├── purchase-item.input.ts
│   │   │   │   │   └── update-item.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── item.entity.ts
│   │   │   │   │   └── purchase.entity.ts
│   │   │   │   ├── marketplace.module.ts
│   │   │   │   ├── marketplace.resolver.ts
│   │   │   │   └── marketplace.service.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── marketplaceresolver.gql-e2e-spec.ts
│   │   │       └── metricscontroller.e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── monitoring-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── monitoring/
│   │   │   │   ├── monitoring.module.ts
│   │   │   │   ├── monitoring.resolver.ts
│   │   │   │   └── monitoring.service.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── monitoringresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── notifications-service/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   └── .keep
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   └── env.validation.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── notifications/
│   │   │   │   ├── notifications.controller.ts
│   │   │   │   ├── notifications.module.ts
│   │   │   │   ├── notifications.resolver.ts
│   │   │   │   └── notifications.service.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── notifications-service.controller.ts
│   │   │   ├── notifications-service.service.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── basic.spec.ts
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── notifications.spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       ├── notification.flow.e2e-spec.ts
│   │   │       └── notificationsresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.js
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── nutrition-service/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   └── .keep
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   ├── prisma-middleware.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── nutrition/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-food-item.input.ts
│   │   │   │   │   ├── create-meal.input.ts
│   │   │   │   │   ├── set-nutrition-goal.input.ts
│   │   │   │   │   ├── update-food-item.input.ts
│   │   │   │   │   └── update-meal.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   ├── daily-nutrition-summary.entity.ts
│   │   │   │   │   ├── food-item.entity.ts
│   │   │   │   │   ├── meal.entity.ts
│   │   │   │   │   ├── nutrition-goal.entity.ts
│   │   │   │   │   └── nutrition-progress.entity.ts
│   │   │   │   ├── nutrition.module.ts
│   │   │   │   ├── nutrition.resolver.ts
│   │   │   │   └── nutrition.service.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── nutritionresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── payments-service/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   └── .keep
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   └── env.validation.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── payments/
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.resolver.ts
│   │   │   │   └── payments.service.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── payments-service.controller.ts
│   │   │   ├── payments-service.service.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── basic.spec.ts
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── payments.spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── paymenttype.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.js
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── predictive-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── predictive/
│   │   │   │   ├── predictive.module.ts
│   │   │   │   ├── predictive.resolver.ts
│   │   │   │   └── predictive.service.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── predictiveresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── reward-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── reward/
│   │   │   │   ├── reward.module.ts
│   │   │   │   ├── reward.resolver.ts
│   │   │   │   └── reward.service.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── rewardresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── users-service/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   └── .keep
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   ├── prisma-middleware.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── users/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-user.input.ts
│   │   │   │   │   └── update-user.input.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.resolver.ts
│   │   │   │   └── users.service.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── usersresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   ├── vip-service/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   │       └── .keep
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── interceptors/
│   │   │   │       └── logging.interceptor.ts
│   │   │   ├── config/
│   │   │   │   ├── env.validation.ts
│   │   │   │   └── graphql.config.ts
│   │   │   ├── dataloader/
│   │   │   │   └── index.ts
│   │   │   ├── graphql/
│   │   │   │   └── dataloader.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   └── health.module.ts
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   ├── metrics.middleware.ts
│   │   │   │   └── metrics.module.ts
│   │   │   ├── security/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── vip/
│   │   │   │   ├── vip.module.ts
│   │   │   │   ├── vip.resolver.ts
│   │   │   │   └── vip.service.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── ping.service.ts
│   │   │   └── tracing.ts
│   │   ├── test/
│   │   │   ├── health.e2e-spec.ts
│   │   │   ├── jest-e2e.json
│   │   │   ├── metrics.e2e-spec.ts
│   │   │   ├── ping.service.spec.ts
│   │   │   └── ping.service.ts
│   │   ├── tests/
│   │   │   └── e2e/
│   │   │       ├── healthcontroller.e2e-spec.ts
│   │   │       ├── metricscontroller.e2e-spec.ts
│   │   │       └── vipresolver.gql-e2e-spec.ts
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── jest.config.ts
│   │   ├── package.json
│   │   ├── TESTING_GUIDE.md
│   │   └── tsconfig.json
│   └── workouts-service/
│       ├── prisma/
│       │   ├── migrations/
│       │   │   └── .keep
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── src/
│       │   ├── common/
│       │   │   └── interceptors/
│       │   │       └── logging.interceptor.ts
│       │   ├── config/
│       │   │   └── env.validation.ts
│       │   ├── database/
│       │   │   ├── prisma/
│       │   │   ├── prisma-middleware.ts
│       │   │   └── prisma.service.ts
│       │   ├── graphql/
│       │   │   └── dataloader.ts
│       │   ├── health/
│       │   │   ├── health.controller.ts
│       │   │   └── health.module.ts
│       │   ├── metrics/
│       │   │   ├── metrics.controller.ts
│       │   │   ├── metrics.middleware.ts
│       │   │   └── metrics.module.ts
│       │   ├── security/
│       │   │   ├── roles.decorator.ts
│       │   │   └── roles.guard.ts
│       │   ├── workouts/
│       │   │   ├── dto/
│       │   │   │   ├── create-exercise.input.ts
│       │   │   │   ├── create-workout-plan.input.ts
│       │   │   │   ├── create-workout.input.ts
│       │   │   │   ├── update-exercise.input.ts
│       │   │   │   ├── update-workout-plan.input.ts
│       │   │   │   └── update-workout.input.ts
│       │   │   ├── entities/
│       │   │   │   ├── exercise.entity.ts
│       │   │   │   ├── workout-plan.entity.ts
│       │   │   │   ├── workout-progress.entity.ts
│       │   │   │   └── workout.entity.ts
│       │   │   ├── workouts.controller.ts
│       │   │   ├── workouts.module.ts
│       │   │   ├── workouts.resolver.ts
│       │   │   └── workouts.service.ts
│       │   ├── app.module.ts
│       │   ├── main.ts
│       │   ├── ping.service.ts
│       │   ├── tracing.ts
│       │   ├── workouts-service.controller.ts
│       │   └── workouts-service.service.ts
│       ├── test/
│       │   ├── basic.spec.ts
│       │   ├── health.e2e-spec.ts
│       │   ├── jest-e2e.json
│       │   ├── metrics.e2e-spec.ts
│       │   ├── ping.service.spec.ts
│       │   ├── ping.service.ts
│       │   └── workouts.spec.ts
│       ├── tests/
│       │   └── e2e/
│       │       ├── healthcontroller.e2e-spec.ts
│       │       ├── metricscontroller.e2e-spec.ts
│       │       ├── workout.create.e2e-spec.ts
│       │       └── workoutsresolver.gql-e2e-spec.ts
│       ├── .env.example
│       ├── Dockerfile
│       ├── jest.config.js
│       ├── jest.config.ts
│       ├── package.json
│       ├── TESTING_GUIDE.md
│       └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── Challenge/
│   │   │   └── ChallengeList.ts
│   │   ├── Common/
│   │   │   └── DataTable.ts
│   │   ├── Layout/
│   │   │   └── AdminSidebar.ts
│   │   └── Reward/
│   │       └── RewardList.ts
│   ├── context/
│   │   ├── ChallengeContext.ts
│   │   └── RewardContext.ts
│   ├── pages/
│   │   ├── DashboardPage.ts
│   │   ├── LoginPage.ts
│   │   └── UserListPage.ts
│   └── screens/
│       ├── ClientListScreen.ts
│       ├── DashboardScreen.ts
│       └── WorkoutListScreen.ts
├── tests/
│   ├── .github/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_10/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_11/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_12/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_13/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_14/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_15/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_16/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_17/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_18/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_19/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_2/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_20/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_21/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_22/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_23/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_24/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_25/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_26/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_27/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_28/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_29/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_3/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_30/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_31/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_32/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_33/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_34/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_35/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_36/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_37/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_38/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_39/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_4/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_40/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_41/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_42/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_43/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_44/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_45/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_46/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_47/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_48/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_49/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_5/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_6/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_7/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_8/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── .github_9/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── admin-panel/
│   │   ├── e2e/
│   │   │   ├── admin-login.e2e-spec.ts
│   │   │   └── user-crud.e2e-spec.ts
│   │   ├── integration/
│   │   │   └── dashboard-user-integration.spec.ts
│   │   ├── mocks/
│   │   │   ├── admin.mock.ts
│   │   │   └── user.mock.ts
│   │   ├── unit/
│   │   │   ├── components/
│   │   │   │   ├── AdminSidebar.test.tsx
│   │   │   │   └── DataTable.test.tsx
│   │   │   └── pages/
│   │   │       ├── LoginPage.test.tsx
│   │   │       └── UserListPage.test.tsx
│   │   ├── jest.config.js
│   │   └── test-utils.ts
│   ├── backend/
│   │   ├── e2e/
│   │   │   ├── auth.e2e-spec.ts
│   │   │   ├── coach.e2e-spec.ts
│   │   │   ├── notification.e2e-spec.ts
│   │   │   ├── nutrition.e2e-spec.ts
│   │   │   ├── payment.e2e-spec.ts
│   │   │   ├── user.e2e-spec.ts
│   │   │   └── workout.e2e-spec.ts
│   │   ├── integration/
│   │   │   ├── ai-nutrition.integration.spec.ts
│   │   │   ├── coach-challenge.integration.spec.ts
│   │   │   └── user-workout.integration.spec.ts
│   │   ├── mocks/
│   │   │   ├── notification.mock.ts
│   │   │   ├── nutrition.mock.ts
│   │   │   ├── payment.mock.ts
│   │   │   ├── user.mock.ts
│   │   │   └── workout.mock.ts
│   │   ├── unit/
│   │   │   ├── ai-workout.service.spec.ts
│   │   │   ├── auditlog.service.spec.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── challenge.service.spec.ts
│   │   │   ├── coach.service.spec.ts
│   │   │   ├── hashing.service.spec.ts
│   │   │   ├── notification.service.spec.ts
│   │   │   ├── nutrition.service.spec.ts
│   │   │   ├── payment.service.spec.ts
│   │   │   ├── user.service.spec.ts
│   │   │   └── workout.service.spec.ts
│   │   ├── jest.config.js
│   │   └── test-utils.ts
│   ├── e2e/
│   │   └── auth_workout_notification.e2e-spec.ts
│   ├── frontend/
│   │   ├── e2e/
│   │   │   ├── payment-flow.e2e-spec.ts
│   │   │   ├── user-login.e2e-spec.ts
│   │   │   └── workout-flow.e2e-spec.ts
│   │   ├── integration/
│   │   │   ├── challenge-reward-integration.spec.ts
│   │   │   └── dashboard-integration.spec.ts
│   │   ├── mocks/
│   │   │   ├── user.mock.ts
│   │   │   └── workout.mock.ts
│   │   ├── unit/
│   │   │   ├── components/
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Card.test.tsx
│   │   │   │   ├── Input.test.tsx
│   │   │   │   └── NotificationItem.test.tsx
│   │   │   └── pages/
│   │   │       ├── DashboardPage.test.tsx
│   │   │       └── LoginPage.test.tsx
│   │   ├── jest.config.js
│   │   └── test-utils.ts
│   ├── github/
│   │   └── workflows/
│   │       ├── test-admin-panel.yml
│   │       ├── test-backend.yml
│   │       ├── test-coverage-report.yml
│   │       ├── test-frontend.yml
│   │       └── test-mobile.yml
│   ├── mobile/
│   │   ├── coach-app/
│   │   │   ├── e2e/
│   │   │   │   ├── client-manage.e2e-spec.ts
│   │   │   │   └── login-flow.e2e-spec.ts
│   │   │   ├── integration/
│   │   │   │   └── dashboard-client-integration.spec.ts
│   │   │   ├── mocks/
│   │   │   │   ├── client.mock.ts
│   │   │   │   └── coach.mock.ts
│   │   │   ├── unit/
│   │   │   │   ├── components/
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── Card.test.tsx
│   │   │   │   └── screens/
│   │   │   │       ├── ClientListScreen.test.tsx
│   │   │   │       ├── DashboardScreen.test.tsx
│   │   │   │       └── PlanBuilderScreen.test.tsx
│   │   │   ├── jest.config.js
│   │   │   └── test-utils.ts
│   │   └── user-app/
│   │       ├── e2e/
│   │       │   ├── onboarding-flow.e2e-spec.ts
│   │       │   └── workout-submit.e2e-spec.ts
│   │       ├── integration/
│   │       │   └── dashboard-workout-integration.spec.ts
│   │       ├── mocks/
│   │       │   ├── user.mock.ts
│   │       │   └── workout.mock.ts
│   │       ├── unit/
│   │       │   ├── components/
│   │       │   │   ├── Button.test.tsx
│   │       │   │   └── Input.test.tsx
│   │       │   └── screens/
│   │       │       ├── DashboardScreen.test.tsx
│   │       │       ├── ProfileScreen.test.tsx
│   │       │       └── WorkoutListScreen.test.tsx
│   │       ├── jest.config.js
│   │       └── test-utils.ts
│   └── src/
│       ├── ai/
│       │   └── ai-workout.service.ts
│       ├── auditlog/
│       │   └── auditlog.service.ts
│       ├── auth/
│       │   └── auth.service.ts
│       ├── challenges/
│       │   └── challenge.service.ts
│       ├── coaches/
│       │   └── coach.service.ts
│       ├── common/
│       │   └── services/
│       │       └── hashing.service.ts
│       ├── components/
│       │   ├── Common/
│       │   │   ├── Button.ts
│       │   │   ├── Card.ts
│       │   │   └── Input.ts
│       │   ├── Notification/
│       │   │   └── NotificationItem.ts
│       │   ├── Button.ts
│       │   ├── Card.ts
│       │   └── Input.ts
│       ├── notification/
│       │   └── notification.service.ts
│       ├── nutrition/
│       │   └── nutrition.service.ts
│       ├── pages/
│       │   ├── DashboardPage.ts
│       │   └── LoginPage.ts
│       ├── payments/
│       │   └── payment.service.ts
│       ├── screens/
│       │   ├── ClientListScreen.ts
│       │   ├── DashboardScreen.ts
│       │   ├── PlanBuilderScreen.ts
│       │   ├── ProfileScreen.ts
│       │   └── WorkoutListScreen.ts
│       ├── users/
│       │   └── user.service.ts
│       ├── workouts/
│       │   └── workout.service.ts
│       └── main.ts
├── ui-tests/
│   ├── a11y-roles.spec.ts
│   ├── admin.spec.ts
│   ├── theme-toggle.spec.ts
│   ├── vitrin-ui-demo.spec.ts
│   └── vitrin.spec.ts
├── workflows/
│   ├── ai/
│   │   ├── ai-chatbot-handler.ts
│   │   ├── ai-nutrition-suggester.ts
│   │   ├── ai-threat-detection.ts
│   │   └── ai-training-analytics.ts
│   ├── integration/
│   │   ├── notification-service-sync.ts
│   │   ├── payment-gateway-integration.ts
│   │   ├── user-coach-sync.ts
│   │   └── wearable-data-sync.ts
│   └── n8n/
│       ├── ai-response-flow.json
│       ├── bot-support-flow.json
│       ├── challenge-reminder-flow.json
│       ├── payment-processing-flow.json
│       └── reservation-notification-flow.json
├── .editorconfig
├── .env
├── .env.example
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── .gitleaks.toml
├── .node-version
├── .npmrc
├── .nvmrc
├── .prettierrc
├── CHANGELOG.md
├── CHANGES_CI_DOCS.md
├── CHANGES_COMPOSE_UNIFIED.md
├── CHANGES_DB_MIGRATIONS_UNIFICATION.md
├── CHANGES_E2E_TESTS.md
├── CHANGES_HELM_K8S_PROD.md
├── CHANGES_SECURITY_SECRETS.md
├── CLEANUP.md
├── CODE_OF_CONDUCT.md
├── commitlint.config.cjs
├── CONTRIBUTING.md
├── docker-compose.dev.yml
├── docker-compose.override.yml
├── docker-compose.redis.yml
├── docker-compose.yml
├── HARDENING.md
├── HARDENING_SUMMARY.json
├── install.sh
├── jest.config.ts
├── jest.preset.js
├── LICENSE
├── Makefile
├── package.json
├── playwright.config.ts
├── pnpm-workspace.yaml
├── README-DEVEX.md
├── README.md
├── README_ArmanFit.md
├── README_COMPOSE.md
├── README_DB_SETUP.md
├── README_SECRETS.md
├── RELEASE_GUIDE.md
├── renovate.json
├── ROLLBACK_AND_ROLLOUT_NOTES.md
├── SECRETS_MIGRATION_PLAN.md
├── SECURITY.md
├── SECURITY_RELEASE_CHECKLIST.md
├── SECURITY_SECRETS_MIGRATION.md
├── tsconfig.base.json
├── tsconfig.json
├── turbo.json
└── VERSION_SYNC_NOTES.md
```

## Key files detected
- .env
- .env.example
- .eslintrc.json
- .github/workflows
- .node-version
- .npmrc
- .nvmrc
- .prettierrc
- README.md
- apps
- app/armanfit-admin/.env.example
- app/armanfit-admin/README.md
- app/armanfit-admin/package.json
- app/armanfit-admin/tsconfig.json
- app/backend
- app/backend/.env.example
- app/backend/Dockerfile
- app/backend/package.json
- app/backend/scripts/.env.example
- app/backend/scripts/Dockerfile
- app/backend/scripts/README.md
- app/backend/scripts/docker-compose.yml
- app/backend/src/admin
- app/backend/src/common/services
- app/backend/src/database/prisma/schema.prisma
- app/backend/tsconfig.json
- app/coach-app/README.md
- app/coach-app/app.json
- app/coach-app/package.json
- app/coach-app/tsconfig.json
- app/user-app/README.md
- app/user-app/app.json
- app/user-app/package.json
- app/user-app/tsconfig.json
- app/vitrin-site/README.md
- app/vitrin-site/package.json
- app/vitrin-site/tsconfig.json
- devops/docker/.env.example
- docker-compose.yml
- docs/README.md
- helm
- helm/armanfit-admin/Chart.yaml
- helm/armanfit-backend/Chart.yaml
- helm/armanfit-mobile/Chart.yaml
- helm/armanfit/Chart.yaml
- helm/users-service/Chart.yaml
- install.sh
- k8s
- package.json
- packages
- packages/contracts/package.json
- packages/observability/package.json
- packages/observability/tsconfig.json
- packages/shared/package.json
- packages/shared/tsconfig.json
- packages/ui-components/package.json
- packages/ui-components/tsconfig.json
- packages/ui-tokens/package.json
- packages/ui-tokens/tsconfig.json
- pnpm-workspace.yaml
- public/mnt/data/armanvarzesh/armanvarzesh/helm
- services
- services/affiliate-service/.env.example
- services/affiliate-service/Dockerfile
- services/affiliate-service/package.json
- services/affiliate-service/tsconfig.json
- services/ai-service/.env.example
- services/ai-service/Dockerfile
- services/ai-service/package.json
- services/ai-service/tsconfig.json
- services/assessment-service/.env.example
- services/assessment-service/Dockerfile
- services/assessment-service/package.json
- services/assessment-service/tsconfig.json
- services/auth-service/.env.example
- services/auth-service/Dockerfile
- services/auth-service/package.json
- services/auth-service/prisma/schema.prisma
- services/auth-service/tsconfig.json
- services/challenges-service/.env.example
- services/challenges-service/Dockerfile
- services/challenges-service/package.json
- services/challenges-service/tsconfig.json
- services/chat-service/.env.example
- services/chat-service/Dockerfile
- services/chat-service/package.json
- services/chat-service/tsconfig.json
- services/coaches-service/.env.example
- services/coaches-service/Dockerfile
- services/coaches-service/package.json
- services/coaches-service/prisma/schema.prisma
- services/coaches-service/tsconfig.json
- services/content-service/.env.example
- services/content-service/Dockerfile
- services/content-service/package.json
- services/content-service/tsconfig.json
- services/courses-service/.env.example
- services/courses-service/Dockerfile
- services/courses-service/package.json
- services/courses-service/tsconfig.json
- services/marketplace-service/.env.example
- services/marketplace-service/Dockerfile
- services/marketplace-service/package.json
- services/marketplace-service/tsconfig.json
- services/monitoring-service/.env.example
- services/monitoring-service/Dockerfile
- services/monitoring-service/package.json
- services/monitoring-service/tsconfig.json
- services/notifications-service/.env.example
- services/notifications-service/Dockerfile
- services/notifications-service/package.json
- services/notifications-service/prisma/schema.prisma
- services/notifications-service/tsconfig.json
- services/nutrition-service/.env.example
- services/nutrition-service/Dockerfile
- services/nutrition-service/package.json
- services/nutrition-service/prisma/schema.prisma
- services/nutrition-service/tsconfig.json
- services/payments-service/.env.example
- services/payments-service/Dockerfile
- services/payments-service/package.json
- services/payments-service/prisma/schema.prisma
- services/payments-service/tsconfig.json
- services/predictive-service/.env.example
- services/predictive-service/Dockerfile
- services/predictive-service/package.json
- services/predictive-service/tsconfig.json
- services/reward-service/.env.example
- services/reward-service/Dockerfile
- services/reward-service/package.json
- services/reward-service/tsconfig.json
- services/users-service/.env.example
- services/users-service/Dockerfile
- services/users-service/package.json
- services/users-service/prisma/schema.prisma
- services/users-service/tsconfig.json
- services/vip-service/.env.example
- services/vip-service/Dockerfile
- services/vip-service/package.json
- services/vip-service/tsconfig.json
- services/workouts-service/.env.example
- services/workouts-service/Dockerfile
- services/workouts-service/package.json
- services/workouts-service/prisma/schema.prisma
- services/workouts-service/tsconfig.json
- tests/.github/workflows
- tests/backend
- tests/mobile
- tests/src/common/services
- tsconfig.base.json
- tsconfig.json
