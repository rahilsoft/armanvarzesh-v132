
-- Run these in ClickHouse once
CREATE TABLE IF NOT EXISTS default.events (
  app LowCardinality(String),
  name LowCardinality(String),
  ts DateTime,
  uid Nullable(String),
  session Nullable(String),
  ua Nullable(String),
  ip Nullable(String),
  payload JSON
) ENGINE = MergeTree ORDER BY (app, name, ts);
