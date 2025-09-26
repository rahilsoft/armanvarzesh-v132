
-- CTR per tile id and variant (last 7 days)
WITH impressions AS (
  SELECT JSON_VALUE(payload, '$.id') AS id,
         JSON_VALUE(payload, '$.variant') AS variant,
         count() AS imp
  FROM default.events
  WHERE app = 'vitrin-site' AND name = 'tile_impression' AND ts >= now() - INTERVAL 7 DAY
  GROUP BY id, variant
),
clicks AS (
  SELECT JSON_VALUE(payload, '$.id') AS id,
         JSON_VALUE(payload, '$.variant') AS variant,
         count() AS clk
  FROM default.events
  WHERE app = 'vitrin-site' AND name = 'tile_click' AND ts >= now() - INTERVAL 7 DAY
  GROUP BY id, variant
)
SELECT i.id, i.variant, i.imp, c.clk, if(i.imp=0, 0, round(c.clk / i.imp * 100, 2)) AS ctr_pct
FROM impressions i
LEFT JOIN clicks c ON c.id = i.id AND c.variant = i.variant
ORDER BY ctr_pct DESC;
