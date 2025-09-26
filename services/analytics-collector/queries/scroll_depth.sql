
-- Scroll-depth distribution using tile_impression index order as proxy (requires sending 'order' in payload if desired)
SELECT
  JSON_VALUE(payload, '$.order') AS order_index,
  count() AS views
FROM default.events
WHERE app='vitrin-site' AND name='tile_impression' AND ts>= now() - INTERVAL 7 DAY
GROUP BY order_index
ORDER BY toInt32OrZero(order_index);
