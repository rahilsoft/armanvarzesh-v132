# Runbook — Backup & Restore

## Backup
- PostgreSQL: daily full + 15-min WAL; retention 30 days.
- Redis: snapshot hourly; retention 7 days.
- Store in encrypted bucket (KMS).

## Restore (Staging First)
1. Create isolated DB instance; restore the latest full + WAL to timestamp.
2. Rehydrate Redis if needed.
3. Run migrations to target version.
4. Run smoke & data-integrity checks before switching traffic.

## Validation
- Data checksums match; app smoke tests pass; analytics jobs re-caught up.
