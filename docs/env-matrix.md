# Environment Matrix (Current)

این سند بر اساس ساختار فعلی ریپو تولید شده است (`app/*`, `services/*`, `packages/*`).  
منابع این جدول از فایل‌های `.env.example` هر سرویس/اپ گرفته شده‌اند. برای Production از **Secret Manager** استفاده کنید (نگاه کنید به `README_SECRETS.md`).

## Quick paths
- Compose dev: `docker compose --profile dev up -d`
- Migrations: `./scripts/migrate-all.sh`

## Matrix
| مسیر | کلیدهای اصلی (.env.example) |
|---|---|
| `.` | `API_URL, DATABASE_URL, FCM_SERVER_KEY, GRAPHQL_PLAYGROUND, HOST, JWT_EXPIRES_IN, JWT_SECRET, MAIL_FROM, MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER…` |
| `app/armanfit-admin` | `VITE_APP_TITLE, VITE_GRAPHQL_API, VITE_TOKEN_SECRET` |
| `app/backend` | `CORS_ORIGINS, CSP_ENABLED, DATABASE_URL, GRAPHQL_PLAYGROUND, JWT_SECRET, KAVENEGAR_API_KEY, RATE_LIMIT_LIMIT, RATE_LIMIT_TTL, ZARINPAL_MERCHANT_ID, ZARINPAL_SANDBOX` |
| `app/backend/scripts` | `DATABASE_URL, GRAPHQL_PLAYGROUND, JWT_SECRET, KAVENEGAR_API_KEY, NODE_ENV, PORT, REDIS_URL, ZARINPAL_MERCHANT_ID` |
| `devops/docker` | `DATABASE_URL, JWT_SECRET, KAVENEGAR_API_KEY, REDIS_URL, ZARINPAL_MERCHANT_CODE` |
| `services/affiliate-service` | `PORT` |
| `services/ai-service` | `PORT` |
| `services/assessment-service` | `PORT` |
| `services/auth-service` | `DATABASE_URL, JWT_EXPIRES_IN, JWT_SECRET, PORT, REFRESH_TOKEN_EXPIRES_IN` |
| `services/challenges-service` | `PORT` |
| `services/chat-service` | `PORT` |
| `services/coaches-service` | `DATABASE_URL, PORT` |
| `services/content-service` | `PORT` |
| `services/courses-service` | `PORT` |
| `services/marketplace-service` | `PORT` |
| `services/monitoring-service` | `PORT` |
| `services/notifications-service` | `MAIL_HOST, MAIL_PORT` |
| `services/nutrition-service` | `DATABASE_URL, PORT` |
| `services/payments-service` | `STRIPE_SECRET` |
| `services/predictive-service` | `PORT` |
| `services/reward-service` | `PORT` |
| `services/users-service` | `DATABASE_URL, PORT` |
| `services/vip-service` | `PORT` |
| `services/workouts-service` | `DATABASE_URL, PORT` |
