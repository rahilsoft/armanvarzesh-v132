/**
 * JWT DataSource tests for GraphQL Gateway.
 *
 * These previously re-implemented willSendRequest inline and asserted against
 * that copy, so they passed no matter what the real class did. They now drive
 * the real JwtDataSource.
 */
import { JwtDataSource } from '../src/jwt-datasource';

function makeRequest() {
  return { http: { headers: new Map<string, string>() } };
}

describe('GraphQL Gateway - JWT DataSource', () => {
  const ds = new JwtDataSource({ url: 'http://subgraph.invalid/graphql' });

  it('propagates the authorization header to subgraph requests', () => {
    const request = makeRequest();
    ds.willSendRequest({ request, context: { authHeader: 'Bearer test-token' } } as any);
    expect(request.http.headers.get('authorization')).toBe('Bearer test-token');
  });

  it('sets no authorization header when the context is empty', () => {
    const request = makeRequest();
    ds.willSendRequest({ request, context: {} } as any);
    expect(request.http.headers.get('authorization')).toBeUndefined();
  });

  it('sets no authorization header when authHeader is undefined', () => {
    const request = makeRequest();
    ds.willSendRequest({ request, context: { authHeader: undefined } } as any);
    expect(request.http.headers.get('authorization')).toBeUndefined();
  });

  it('sets no authorization header for an empty-string authHeader', () => {
    const request = makeRequest();
    ds.willSendRequest({ request, context: { authHeader: '' } } as any);
    expect(request.http.headers.get('authorization')).toBeUndefined();
  });

  it('tolerates a missing context', () => {
    const request = makeRequest();
    expect(() => ds.willSendRequest({ request, context: undefined } as any)).not.toThrow();
    expect(request.http.headers.get('authorization')).toBeUndefined();
  });

  it('tolerates a request with no http object', () => {
    expect(() =>
      ds.willSendRequest({ request: {}, context: { authHeader: 'Bearer t' } } as any),
    ).not.toThrow();
  });
});
