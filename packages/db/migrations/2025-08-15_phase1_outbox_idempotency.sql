-- Outbox
CREATE TABLE IF NOT EXISTS outbox_events (
  id BIGSERIAL PRIMARY KEY,
  aggregate TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  retry_count INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_outbox_unpub ON outbox_events (published_at) WHERE published_at IS NULL;

-- Idempotency
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scope TEXT,
  meta JSONB
);

-- Example indexes (adjust table/columns to real schema)
-- CREATE INDEX IF NOT EXISTS idx_workout_user_date ON "Workout" ("userId","date");

-- Materialized view example (adjust names)
-- CREATE MATERIALIZED VIEW IF NOT EXISTS mv_coach_kpi AS
-- SELECT c.id AS coach_id,
--        count(w.id) AS workouts_count_30d,
--        sum(CASE WHEN w.completed THEN 1 ELSE 0 END) AS completed_count_30d
-- FROM "Coach" c
-- LEFT JOIN "Workout" w ON w.coachId = c.id AND w.date > now() - interval '30 days'
-- GROUP BY c.id;
-- CREATE INDEX IF NOT EXISTS idx_mv_coach_kpi_coach ON mv_coach_kpi (coach_id);
