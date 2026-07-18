/* eslint-disable @typescript-eslint/no-var-requires --
   OpenTelemetry packages are optional runtime dependencies: they are
   require()d lazily inside try/catch so the backend still boots when the
   otel stack is not deployed (OTEL_EXPORTER_OTLP_ENDPOINT unset). */
/**
 * Execute `fn` inside a tracing span when OpenTelemetry is available, otherwise
 * just run `fn`. Keeps call sites simple and dependency-free at runtime.
 */
export async function withSpan<T>(
  name: string,
  _attrs: Record<string, unknown>,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    const api = require('@opentelemetry/api');
    const tracer = api.trace.getTracer('backend');
    return await tracer.startActiveSpan(name, async (span: any) => {
      try {
        for (const [k, v] of Object.entries(_attrs)) span.setAttribute(k, v as any);
        return await fn();
      } finally {
        span.end();
      }
    });
  } catch {
    return fn();
  }
}

export async function initTracing() {
  // Lazy init to avoid hard dependency at runtime
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;
  try {
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const { resourceFromAttributes } = require('@opentelemetry/resources');
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
    const svc = process.env.OTEL_SERVICE_NAME || 'backend';
    const exporter = new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces' });
    const sdk = new NodeSDK({
      resource: resourceFromAttributes({ [SemanticResourceAttributes.SERVICE_NAME]: svc }),
      traceExporter: exporter,
      instrumentations: [ getNodeAutoInstrumentations() ]
    });
    await sdk.start();
    process.on('SIGTERM', () => sdk.shutdown().catch(()=>{}));
    process.on('beforeExit', () => sdk.shutdown().catch(()=>{}));
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', msg: 'OTel tracing initialized', svc }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ ts: new Date().toISOString(), level: 'error', msg: 'OTel init failed', err: String(e) }));
  }
}
