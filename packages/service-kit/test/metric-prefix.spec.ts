import { metricPrefix } from '../src/server';

/**
 * Regression: the prefix was interpolated straight from SERVICE_NAME, and every
 * service in this repo is named with a hyphen ("chat-service"). Prometheus
 * rejects those characters, so collectDefaultMetrics threw "Invalid metric
 * name" and createApp failed at startup for every one of them.
 */
describe('metricPrefix', () => {
  const VALID = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;

  it('replaces hyphens so the name is valid', () => {
    expect(metricPrefix('chat-service')).toBe('chat_service_');
    expect(VALID.test(`${metricPrefix('chat-service')}process_cpu_seconds_total`)).toBe(true);
  });

  it('produces a valid prefix for every service name in the repo', () => {
    const names = [
      'users-service', 'chat-service', 'content-service', 'payments-service',
      'graphql-gateway', 'api-gateway', 'media-worker', 'kpis-service',
    ];
    for (const n of names) {
      expect(VALID.test(`${metricPrefix(n)}x`)).toBe(true);
    }
  });

  it('leaves an already-valid name alone apart from the separator', () => {
    expect(metricPrefix('service')).toBe('service_');
    expect(metricPrefix('my_service')).toBe('my_service_');
  });

  it('prepends an underscore when the name starts with a digit', () => {
    expect(metricPrefix('2fast')).toBe('_2fast_');
    expect(VALID.test(`${metricPrefix('2fast')}x`)).toBe(true);
  });

  it('falls back to a usable prefix for empty input', () => {
    expect(metricPrefix('')).toBe('service_');
    expect(metricPrefix(undefined as any)).toBe('service_');
  });

  it('strips dots, slashes and spaces', () => {
    expect(metricPrefix('a.b/c d')).toBe('a_b_c_d_');
  });
});
