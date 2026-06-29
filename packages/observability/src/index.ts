export * from './otel';

import { initTelemetry } from './otel';

/**
 * Initialize tracing/telemetry for a service. Safe no-op if the OpenTelemetry
 * SDK or exporter is unavailable.
 */
export async function initTracing(serviceName = process.env.OTEL_SERVICE_NAME || 'service'): Promise<void> {
  try { await initTelemetry(serviceName); } catch { /* telemetry is best-effort */ }
}

/** Alias for {@link initTracing}. */
export const startTracing = initTracing;

/** High-level entry point used by service-kit and service `main.ts` files. */
export async function setupObservability(serviceName = process.env.OTEL_SERVICE_NAME || 'service'): Promise<void> {
  await initTracing(serviceName);
}
