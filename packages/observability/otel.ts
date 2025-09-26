/**
 * OTEL bridge (placeholder). Plugs into OTLP HTTP exporter if env provided.
 * In production, replace with @opentelemetry/api + web/tracing SDK.
 */
export type OtelConfig = { endpoint?: string; headers?: Record<string,string> };
let cfg: OtelConfig = {
  endpoint: (typeof process!=='undefined' && process.env && (process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT||process.env.OTEL_EXPORTER_OTLP_ENDPOINT)) || ''
};
export function configureOtel(c: Partial<OtelConfig>){ cfg = { ...cfg, ...c }; }
export function exportSpan(span: any){
  if(!cfg.endpoint) return;
  try{ fetch(cfg.endpoint, { method:'POST', headers:{'Content-Type':'application/json', ...(cfg.headers||{})}, body: JSON.stringify({ resource:'web', spans:[span] })}); } catch {}
}
