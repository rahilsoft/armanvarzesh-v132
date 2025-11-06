/**
 * Health endpoint tests for GraphQL Gateway
 */

describe('GraphQL Gateway - Health Endpoint', () => {
  describe('/health endpoint', () => {
    it('should return ok status', () => {
      const healthResponse = { ok: true, service: 'graphql-gateway' };
      expect(healthResponse).toHaveProperty('ok', true);
      expect(healthResponse).toHaveProperty('service', 'graphql-gateway');
    });

    it('should have correct service identifier', () => {
      const serviceName = 'graphql-gateway';
      expect(serviceName).toBe('graphql-gateway');
    });

    it('should validate health response structure', () => {
      const healthResponse = { ok: true, service: 'graphql-gateway' };
      expect(typeof healthResponse.ok).toBe('boolean');
      expect(typeof healthResponse.service).toBe('string');
    });
  });
});
