-- CTR by UTM source/campaign (7d)
SELECT
  JSON_VALUE(payload,'$.id') AS id,
  coalesce(JSON_VALUE(payload,'$.variant'), '—') AS variant,
  coalesce(JSON_VALUE(payload,'$.utm_source'), 'direct') AS utm_source,
  coalesce(JSON_VALUE(payload,'$.utm_campaign'), '—') AS utm_campaign,
  countIf(name='tile_impression') AS imp,
  countIf(name='tile_click') AS clk,
  if(imp=0,0, round(clk/imp*100,2)) AS ctr_pct
FROM default.events
WHERE app='vitrin-site' AND name IN ('tile_impression','tile_click') AND ts>= now()-INTERVAL 7 DAY
GROUP BY id, variant, utm_source, utm_campaign
ORDER BY ctr_pct DESC;