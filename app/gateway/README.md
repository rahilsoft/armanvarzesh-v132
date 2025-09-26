# API Gateway

Edge Gateway with:
- **Rate-limit** (user-aware) و **JWT passthrough/verify** (downstream may re-verify)
- **Body size limits** (default 1MB) و محافظت‌های Helmet/HPP
- **Routing** به خدمات داخلی: `/bff`, `/payments`, `/notifications`, `/coach`, `/chat`, `/activities`
- **/health, /ready, /metrics**

## Env
- `PORT` (default 4089)
- `BODY_LIMIT` (e.g., "2mb")
- `BFF_URL`, `PAYMENTS_URL`, `NOTIFS_URL`, `COACH_URL`, `CHAT_URL`, `ACTIVITIES_URL`

## Run
```bash
pnpm -F @arman/gateway build && pnpm -F @arman/gateway start
```


## WAF / CORS
- **Blocked methods**: TRACE/TRACK/CONNECT
- **Path denylist**: traversal (`../`, encoded), `.git/`, `._internal/`, `.env`, common NoSQL inj tokens
- **Header denylist**: `x-forwarded-host`
- **CORS allowlist**: `ALLOW_ORIGINS` (CSV), default: local dev origins
- **Body size**: `BODY_LIMIT` (Express parser) و `BODY_LIMIT_BYTES` (WAF early check)
