-- A/B significance test (z-score) last 14 days; group by logical id (or tile id), variant
WITH base AS (
  SELECT
    JSON_VALUE(payload, '$.id') AS id,
    JSON_VALUE(payload, '$.variant') AS variant,
    countIf(name='tile_impression') AS imp,
    countIf(name='tile_click') AS clk
  FROM default.events
  WHERE app='vitrin-site' AND name IN ('tile_impression','tile_click') AND ts>= now()-INTERVAL 14 DAY
  GROUP BY id, variant
),
pairs AS (
  SELECT id, anyHeavy(variant) as variant, sum(imp) imp, sum(clk) clk
  FROM base
  GROUP BY id, variant
)
SELECT
  a.id,
  a.variant as variant_a, a.imp as imp_a, a.clk as clk_a, if(a.imp=0,0, clk_a/imp_a) as ctr_a,
  b.variant as variant_b, b.imp as imp_b, b.clk as clk_b, if(b.imp=0,0, clk_b/imp_b) as ctr_b,
  ( ( (clk_a/imp_a) - (clk_b/imp_b) ) / sqrt( ((clk_a+clk_b)/(imp_a+imp_b))*(1-((clk_a+clk_b)/(imp_a+imp_b))) * (1/imp_a + 1/imp_b) ) ) as z_score
FROM pairs a
INNER JOIN pairs b ON a.id=b.id AND a.variant < b.variant
ORDER BY abs(z_score) DESC;