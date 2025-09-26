
-- Simple funnel: pageview -> impression -> click (same session) for last 7 days
WITH pv AS (
  SELECT session, count() AS n FROM default.events
  WHERE app='vitrin-site' AND name='pageview' AND ts>= now()-INTERVAL 7 DAY
  GROUP BY session
),
imp AS (
  SELECT session, count() AS n FROM default.events
  WHERE app='vitrin-site' AND name='tile_impression' AND ts>= now()-INTERVAL 7 DAY
  GROUP BY session
),
clk AS (
  SELECT session, count() AS n FROM default.events
  WHERE app='vitrin-site' AND name='tile_click' AND ts>= now()-INTERVAL 7 DAY
  GROUP BY session
)
SELECT
  (SELECT count() FROM pv) AS sessions_with_pageview,
  (SELECT count() FROM imp) AS sessions_with_impression,
  (SELECT count() FROM clk) AS sessions_with_click;
