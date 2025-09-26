
import { NextRequest, NextResponse } from 'next/server';

const CH_URL = process.env.CLICKHOUSE_URL || '';
const CH_DB = process.env.CLICKHOUSE_DB || 'default';
const CH_USER = process.env.CLICKHOUSE_USER || '';
const CH_PASS = process.env.CLICKHOUSE_PASSWORD || '';

const ALLOWED = new Map<string,string>([
  ['ctr_per_tile', `WITH impressions AS (
    SELECT JSON_VALUE(payload, '$.id') AS id,
           JSON_VALUE(payload, '$.variant') AS variant,
           count() AS imp
    FROM ${CH_DB}.events
    WHERE app = 'vitrin-site' AND name = 'tile_impression' AND ts >= now() - INTERVAL 7 DAY
    GROUP BY id, variant
  ),
  clicks AS (
    SELECT JSON_VALUE(payload, '$.id') AS id,
           JSON_VALUE(payload, '$.variant') AS variant,
           count() AS clk
    FROM ${CH_DB}.events
    WHERE app = 'vitrin-site' AND name = 'tile_click' AND ts >= now() - INTERVAL 7 DAY
    GROUP BY id, variant
  )
  SELECT i.id, i.variant, i.imp, c.clk, if(i.imp=0, 0, round(c.clk / i.imp * 100, 2)) AS ctr_pct
  FROM impressions i
  LEFT JOIN clicks c ON c.id = i.id AND c.variant = i.variant
  ORDER BY ctr_pct DESC`],
  ['conversion_from_tile', `WITH clk AS (
    SELECT session, JSON_VALUE(payload,'$.id') AS id, JSON_VALUE(payload,'$.variant') AS variant, min(ts) as first_clk
    FROM ${CH_DB}.events WHERE app='vitrin-site' AND name='tile_click' AND ts>= now()-INTERVAL 7 DAY
    GROUP BY session, id, variant
  ),
  su AS (
    SELECT session, min(ts) as signup_ts
    FROM ${CH_DB}.events WHERE app='vitrin-site' AND name='signup_complete' AND ts>= now()-INTERVAL 7 DAY
    GROUP BY session
  )
  SELECT c.id, c.variant, count() clicks, countIf(su.signup_ts >= c.first_clk) signups,
         roundIf(signups/clicks*100,2) as cr_pct
  FROM clk c
  LEFT JOIN su ON su.session = c.session
  GROUP BY c.id, c.variant
  ORDER BY cr_pct DESC`],
  ['ab_significance', `WITH base AS (
    SELECT
      JSON_VALUE(payload, '$.id') AS id,
      JSON_VALUE(payload, '$.variant') AS variant,
      countIf(name='tile_impression') AS imp,
      countIf(name='tile_click') AS clk
    FROM ${CH_DB}.events
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
  ORDER BY abs(z_score) DESC`],
  ['ctr_by_utm', `SELECT
    JSON_VALUE(payload,'$.id') AS id,
    coalesce(JSON_VALUE(payload,'$.variant'), '—') AS variant,
    coalesce(JSON_VALUE(payload,'$.utm_source'), 'direct') AS utm_source,
    coalesce(JSON_VALUE(payload,'$.utm_campaign'), '—') AS utm_campaign,
    countIf(name='tile_impression') AS imp,
    countIf(name='tile_click') AS clk,
    if(imp=0,0, round(clk/imp*100,2)) AS ctr_pct
  FROM ${CH_DB}.events
  WHERE app='vitrin-site' AND name IN ('tile_impression','tile_click') AND ts>= now()-INTERVAL 7 DAY
  GROUP BY id, variant, utm_source, utm_campaign
  ORDER BY ctr_pct DESC`],
  ['webvitals_p95', `SELECT
    replaceOne(name,'webvitals_','') AS metric,
    quantileExact(0.95)(toFloat64(JSON_VALUE(payload, '$.value'))) AS p95
  FROM ${CH_DB}.events
  WHERE app='vitrin-site' AND name LIKE 'webvitals_%' AND ts>= now()-INTERVAL 7 DAY
  GROUP BY metric
  ORDER BY metric`],
]);

export async function GET(req: NextRequest){
  try{
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'ctr_per_tile';
    const sql = ALLOWED.get(name as string);
    if (!sql) return NextResponse.json({ error: 'query_not_allowed' }, { status: 400 });
    if (!CH_URL) return NextResponse.json({ error: 'no_clickhouse' }, { status: 500 });
    const body = sql;
    const headers: any = { 'Content-Type': 'text/plain' };
    if (CH_USER) headers['Authorization'] = 'Basic ' + Buffer.from(CH_USER + ':' + CH_PASS).toString('base64');
    const r = await fetch(CH_URL + '?default_format=JSON', { method:'POST', headers, body });
    const j = await r.json();
    return NextResponse.json(j);
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'ERR' }, { status: 500 });
  }
}
