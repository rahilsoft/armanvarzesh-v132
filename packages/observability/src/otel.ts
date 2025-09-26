// Lightweight OpenTelemetry bootstrap (SDK choice up to runtime env)
export async function initTelemetry(serviceName: string) {
  try {
    // Lazy import to avoid forcing deps if not installed in all envs
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { Resource } = await import('@opentelemetry/resources');
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');

    const exporter = new OTLPTraceExporter(); // uses OTEL_EXPORTER_OTLP_ENDPOINT if set
    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    await sdk.start();
    process.on('SIGTERM', () => sdk.shutdown());
    return true;
  } catch (e) {
    // OpenTelemetry deps may not be installed in all packages; fail-soft
    console.warn('[otel] skipped init (missing deps or not requested):', String(e));
    return false;
  }
}
