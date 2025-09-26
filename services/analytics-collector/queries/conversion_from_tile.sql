
-- Conversion from tile_click to signup_complete grouped by tile id & variant (7d)
WITH clk AS (
  SELECT session, JSON_VALUE(payload,'$.id') AS id, JSON_VALUE(payload,'$.variant') AS variant, min(ts) as first_clk
  FROM default.events WHERE app='vitrin-site' AND name='tile_click' AND ts>= now()-INTERVAL 7 DAY
  GROUP BY session, id, variant
),
su AS (
  SELECT session, min(ts) as signup_ts
  FROM default.events WHERE app='vitrin-site' AND name='signup_complete' AND ts>= now()-INTERVAL 7 DAY
  GROUP BY session
)
SELECT c.id, c.variant, count() clicks, countIf(su.signup_ts >= c.first_clk) signups,
       roundIf(signups/clicks*100,2) as cr_pct
FROM clk c
LEFT JOIN su ON su.session = c.session
GROUP BY c.id, c.variant
ORDER BY cr_pct DESC;
