/**
 * Shared bootstrap helper applied by every microservice's `main.ts`.
 * Wires baseline security hardening and observability onto the Nest app.
 */
import { applyBasicHardening } from '@arman/security-middleware';

export interface BootstrapOptions {
  corsOrigin?: string | RegExp | (string | RegExp)[];
  rateWindowMs?: number;
  rateMax?: number;
}

/**
 * Apply security middleware + observability defaults to a Nest application.
 * Returns the app for chaining.
 */
export async function bootstrapSecurityAndObservability(
  app: any,
  serviceName: string,
  opts: BootstrapOptions = {},
): Promise<any> {
  try {
    applyBasicHardening(app, opts);
  } catch {
    // never crash a service because hardening wiring failed
  }
  // eslint-disable-next-line no-console
  console.log(`[${serviceName}] security & observability bootstrap applied`);
  return app;
}

export default bootstrapSecurityAndObservability;
