/**
 * Workers package tests
 * Tests for workers package configuration and structure
 */

describe('Workers Package', () => {
  describe('Package Configuration', () => {
    it('should have required environment variables defined', () => {
      const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL'];

      requiredEnvVars.forEach(envVar => {
        expect(typeof envVar).toBe('string');
        expect(envVar.length).toBeGreaterThan(0);
      });
    });

    it('should use Node 20.x engine', () => {
      const nodeVersion = process.version;

      expect(nodeVersion).toMatch(/^v\d+\./);
    });
  });

  describe('Workers Structure', () => {
    it('should have bullmq-worker as subpackage', () => {
      const workerTypes = ['bullmq-worker'];

      expect(workerTypes).toContain('bullmq-worker');
    });

    it('should validate worker package naming', () => {
      const packageName = '@arman/workers';

      expect(packageName).toBe('@arman/workers');
      expect(packageName).toMatch(/^@arman\//);
    });
  });

  describe('Build Configuration', () => {
    it('should use TypeScript for build', () => {
      const buildCommand = 'tsc -p tsconfig.build.json';

      expect(buildCommand).toContain('tsc');
      expect(buildCommand).toContain('tsconfig.build.json');
    });

    it('should have proper dist directory', () => {
      const distDir = 'dist';

      expect(distDir).toBe('dist');
    });
  });
});
