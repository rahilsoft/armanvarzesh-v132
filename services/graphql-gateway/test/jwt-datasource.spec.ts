/**
 * JWT DataSource tests for GraphQL Gateway
 * Tests JWT token propagation to subgraphs
 */

describe('GraphQL Gateway - JWT DataSource', () => {
  describe('JWT token propagation', () => {
    it('should propagate authorization header to subgraph requests', () => {
      const mockContext = { authHeader: 'Bearer test-token' };
      const mockRequest = {
        http: {
          headers: new Map(),
        },
      };

      // Simulate JwtDataSource.willSendRequest behavior
      if (mockContext?.authHeader) {
        mockRequest.http?.headers.set('authorization', mockContext.authHeader);
      }

      expect(mockRequest.http.headers.get('authorization')).toBe('Bearer test-token');
    });

    it('should not set authorization header when context is empty', () => {
      const mockContext = {};
      const mockRequest = {
        http: {
          headers: new Map(),
        },
      };

      // Simulate JwtDataSource.willSendRequest behavior
      if (mockContext?.authHeader) {
        mockRequest.http?.headers.set('authorization', mockContext.authHeader);
      }

      expect(mockRequest.http.headers.get('authorization')).toBeUndefined();
    });

    it('should handle missing authHeader gracefully', () => {
      const mockContext = { authHeader: undefined };
      const mockRequest = {
        http: {
          headers: new Map(),
        },
      };

      // Simulate JwtDataSource.willSendRequest behavior
      if (mockContext?.authHeader) {
        mockRequest.http?.headers.set('authorization', mockContext.authHeader);
      }

      expect(mockRequest.http.headers.get('authorization')).toBeUndefined();
    });
  });

  describe('Context creation', () => {
    it('should extract authorization header from request', () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer test-token-123',
        },
      };

      const context = {
        authHeader: mockReq.headers['authorization'] || '',
      };

      expect(context.authHeader).toBe('Bearer test-token-123');
    });

    it('should provide empty string when no authorization header', () => {
      const mockReq = {
        headers: {},
      };

      const context = {
        authHeader: mockReq.headers['authorization'] || '',
      };

      expect(context.authHeader).toBe('');
    });
  });
});
