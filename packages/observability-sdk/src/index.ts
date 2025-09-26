import http from 'node:http';
import process from 'node:process';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { diag } from '@opentelemetry/api';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions';

export type OtelInitOptions = {
  serviceName?: string;
  serviceVersion?: string;
  environment?: string;
  metricsPort?: number;
  metricsPath?: string;
  tracesEnabled?: boolean;
  otlpEndpoint?: string;       // e.g. http://otel-collector:4318/v1/traces
  otlpHeaders?: string;        // key1=val1,key2=val2
};

let _registry: Registry | null = null;
let _server: http.Server | null = null;
let _tracingStarted = false;
let _shutdown: null | (() => Promise<void>) = null;

function parseHeaders(h?: string): Record<string,string> {
  if(!h) return {};
  return Object.fromEntries(h.split(",").map(seg=>{
    const i = seg.indexOf("=");
    if(i<0) return [seg.trim(), ""];
    return [seg.slice(0,i).trim(), seg.slice(i+1).trim()];
  }));
}

function inferServiceName(): string {
  try {
    const parts = process.cwd().split(/[\\/]/).filter(Boolean);
    return process.env.OTEL_SERVICE_NAME || parts.slice(-1)[0] || "unknown-service";
  } catch {
    return "unknown-service";
  }
}

function inferServiceVersion(): string {
  return process.env.OTEL_SERVICE_VERSION || "0.0.0";
}

export function initOpenTelemetry(opts: OtelInitOptions = {}): void {
  const serviceName = opts.serviceName || inferServiceName();
  const env = opts.environment || process.env.OTEL_ENVIRONMENT || process.env.NODE_ENV || "development";
  const version = opts.serviceVersion || inferServiceVersion();

  // Logger: keep quiet in production
  diag.setLogger({ debug: ()=>{}, info: ()=>{}, warn: ()=>{}, error: ()=>{} } as any);

  // Metrics (prom-client) minimal
  if (!_registry) {
    _registry = new Registry();
    collectDefaultMetrics({ register: _registry, labels: { service: serviceName, env } as any });
  }

  // Tracing: opt-in by env or presence of endpoint
  const envEnabled = String(process.env.OTEL_TRACES_ENABLED || "").toLowerCase();
  const tracesEnabled = typeof opts.tracesEnabled === "boolean"
    ? opts.tracesEnabled
    : (envEnabled === "1" || envEnabled === "true" || !!process.env.OTEL_EXPORTER_OTLP_ENDPOINT);

  if (tracesEnabled && !_tracingStarted) {
    _tracingStarted = true;
    // run async, no await to not block service boot
    startNodeSdkTracing({
      serviceName,
      serviceVersion: version,
      environment: env,
      endpoint: opts.otlpEndpoint || process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://otel-collector:4318/v1/traces",
      headers: parseHeaders(opts.otlpHeaders || process.env.OTEL_EXPORTER_OTLP_HEADERS)
    }).catch((e)=>{
      // eslint-disable-next-line no-console
      console.warn("[observability-sdk] tracing disabled (sdk not installed or failed):", e?.message || e);
      _tracingStarted = false;
    });
  }
}

export function startMetricsServer(port = defaultMetricsPort(), path = defaultMetricsPath()): void {
  if (!_registry) initOpenTelemetry();
  if (_server) return;
  _server = http.createServer(async (req, res) => {
    if (!req.url) { res.statusCode = 404; return res.end(); }
    if (req.url.split('?')[0] !== path) { res.statusCode = 404; return res.end('Not Found'); }
    try {
      const metrics = await _registry!.metrics();
      res.setHeader('Content-Type', _registry!.contentType);
      res.writeHead(200);
      res.end(metrics);
    } catch (e:any) {
      res.writeHead(500);
      res.end(String(e?.message ?? e));
    }
  });
  _server.listen(port);
}

export function getRegistry(): Registry {
  if (!_registry) initOpenTelemetry();
  return _registry!;
}

export function defaultMetricsPort(): number {
  const raw = process.env.METRICS_PORT || process.env.PORT_METRICS;
  return raw ? Number(raw) : 9464;
}
export function defaultMetricsPath(): string {
  return process.env.METRICS_PATH || "/metrics";
}

export function domainLabels(extra?: Record<string,string|number|boolean>) {
  return {
    user_id: process.env.USER_ID || "",
    coach_id: process.env.COACH_ID || "",
    payment_id: process.env.PAYMENT_ID || "",
    reservation_id: process.env.RESERVATION_ID || "",
    ...(extra ?? {})
  };
}

// -------- Tracing (dynamic) --------
async function startNodeSdkTracing(args: { serviceName:string; serviceVersion:string; environment:string; endpoint:string; headers:Record<string,string>; }) {
  // Dynamic imports so package remains light if opentelemetry sdk not installed
  const [{ NodeSDK }, { getNodeAutoInstrumentations }, { OTLPTraceExporter }, { Resource }] = await Promise.all([
    import('@opentelemetry/sdk-node'),
    import('@opentelemetry/auto-instrumentations-node'),
    import('@opentelemetry/exporter-trace-otlp-http'),
    import('@opentelemetry/resources')
  ]);

  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: args.serviceName,
    [SEMRESATTRS_SERVICE_VERSION]: args.serviceVersion,
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: args.environment
  });

  const exporter = new OTLPTraceExporter({
    url: args.endpoint,
    headers: args.headers
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter: exporter,
    instrumentations: [ getNodeAutoInstrumentations({
      // reasonable defaults; can be tuned per-service later
      '@opentelemetry/instrumentation-http': { ignoreIncomingPaths: [/\/metrics/i] },
      '@opentelemetry/instrumentation-express': {},
      '@opentelemetry/instrumentation-graphql': {},
      '@opentelemetry/instrumentation-pg': {},
      '@opentelemetry/instrumentation-redis-4': {},
    }) ]
  });

  await sdk.start();
  _shutdown = () => sdk.shutdown();
  // graceful shutdown hooks
  const stop = async ()=>{
    try{ await _shutdown?.(); }catch{}
  };
  process.once('SIGTERM', stop);
  process.once('SIGINT', stop);
}