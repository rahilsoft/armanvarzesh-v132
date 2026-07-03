# ⚠️ DEPRECATED — consolidated into the canonical extension service

Per the extension-layer consolidation (ownership map §B):
- `inbox-service` → **notifications-service** (`NotificationInbox` model handed off)
- `analytics-collector` / `kpis-service` → **analytics-service** (canonical `Event` + `KpiDaily` schema created there)

This service's unique models/logic now live in the canonical extension
service. Retirement gated on CI runtime validation + infra rewire
(**EXTENSION-RETIRE** wave). Do not add new features here.
