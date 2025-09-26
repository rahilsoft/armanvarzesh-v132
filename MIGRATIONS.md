
# Unification Migrations

## assessments-service
- Create table `Assessment` with unique `code`.
- Backfill from legacy `assessment(s)` tables and update foreign keys.

## rewards-service
- Create table `Reward` and backfill from legacy `reward(s)` tables.
- Ensure enums/types normalized (coupon, vip, challenge).

## inbox-service
- Create table `NotificationInbox` with indexes on (userId, createdAt) and (userId, readAt).
- Seed sample notifications for demo environments.
