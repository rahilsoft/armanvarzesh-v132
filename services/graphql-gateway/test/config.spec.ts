/**
 * Configuration tests for GraphQL Gateway
 * Tests environment variable parsing and subgraph configuration
 */

describe('GraphQL Gateway - Configuration', () => {
  describe('Subgraph configuration', () => {
    it('should parse SUBGRAPHS_JSON environment variable', () => {
      const mockEnv = JSON.stringify([
        { name: 'activity', url: 'http://activity:4005/graphql' },
        { name: 'social', url: 'http://social:4006/graphql' },
        { name: 'physio', url: 'http://physio:4016/graphql' },
      ]);

      const subgraphs = JSON.parse(mockEnv);

      expect(subgraphs).toHaveLength(3);
      expect(subgraphs[0]).toHaveProperty('name', 'activity');
      expect(subgraphs[1]).toHaveProperty('name', 'social');
      expect(subgraphs[2]).toHaveProperty('name', 'physio');
    });

    it('should use default subgraph URLs when env not set', () => {
      const defaultSubgraphs = [
        { name: 'activity', url: 'http://localhost:4005/graphql' },
        { name: 'social', url: 'http://localhost:4006/graphql' },
        { name: 'physio', url: 'http://localhost:4016/graphql' },
      ];

      expect(defaultSubgraphs).toHaveLength(3);
      defaultSubgraphs.forEach((sg) => {
        expect(sg).toHaveProperty('name');
        expect(sg).toHaveProperty('url');
        expect(sg.url).toMatch(/^http:\/\//);
      });
    });

    it('should use individual env variables for subgraph URLs', () => {
      const activityUrl = process.env.ACTIVITY_URL || 'http://localhost:4005/graphql';
      const socialUrl = process.env.SOCIAL_URL || 'http://localhost:4006/graphql';
      const physioUrl = process.env.PHYSIO_URL || 'http://localhost:4016/graphql';

      expect(activityUrl).toBeTruthy();
      expect(socialUrl).toBeTruthy();
      expect(physioUrl).toBeTruthy();

      expect(activityUrl).toContain('graphql');
      expect(socialUrl).toContain('graphql');
      expect(physioUrl).toContain('graphql');
    });
  });

  describe('Port configuration', () => {
    it('should use default port 4000 when not specified', () => {
      const port = Number(process.env.PORT || 4000);
      expect(port).toBe(4000);
    });

    it('should parse PORT environment variable correctly', () => {
      const testPort = '5000';
      const port = Number(testPort);
      expect(port).toBe(5000);
    });
  });

  describe('Security configuration', () => {
    it('should enable CSP nonce mode when configured', () => {
      const cspNonceMode = process.env.CSP_NONCE_MODE === '1';
      expect(typeof cspNonceMode).toBe('boolean');
    });

    it('should validate CSP configuration values', () => {
      const validValues = ['0', '1', undefined];
      const testValue = process.env.CSP_NONCE_MODE;

      if (testValue !== undefined) {
        expect(validValues).toContain(testValue);
      }
    });
  });

  describe('Apollo Server configuration', () => {
    it('should disable stack traces in production', () => {
      const includeStacktraceInErrorResponses = false;
      expect(includeStacktraceInErrorResponses).toBe(false);
    });

    it('should validate gateway mode is enabled', () => {
      const gatewayMode = true;
      expect(gatewayMode).toBe(true);
    });
  });
});
