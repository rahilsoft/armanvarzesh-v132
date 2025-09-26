export async function initTracing() {
  // Lazy init to avoid hard dependency at runtime
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;
  try {
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const { Resource } = require('@opentelemetry/resources');
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
    const svc = process.env.OTEL_SERVICE_NAME || 'backend';
    const exporter = new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces' });
    const sdk = new NodeSDK({
      resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: svc }),
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
