-- p95 of core web vitals in last 7 days
SELECT
  metric,
  quantileExact(0.95)(toFloat64(JSON_VALUE(payload, '$.value'))) AS p95
FROM default.events
WHERE app='vitrin-site' AND name LIKE 'webvitals_%' AND ts>= now()-INTERVAL 7 DAY
GROUP BY metric
ORDER BY metric