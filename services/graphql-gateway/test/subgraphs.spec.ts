import { resolveBackendUrl, resolveSubgraphs, DEV_BACKEND_URL } from '../src/subgraphs.js';

describe('resolveBackendUrl', () => {
  it('uses BACKEND_URL when set', () => {
    expect(resolveBackendUrl({ BACKEND_URL: 'http://armanfit-backend:80/graphql', NODE_ENV: 'production' }))
      .toBe('http://armanfit-backend:80/graphql');
  });

  it('trims surrounding whitespace from BACKEND_URL', () => {
    expect(resolveBackendUrl({ BACKEND_URL: '  https://api.example.test/graphql ', NODE_ENV: 'production' }))
      .toBe('https://api.example.test/graphql');
  });

  it('falls back to localhost only when NODE_ENV is development', () => {
    expect(resolveBackendUrl({ NODE_ENV: 'development' })).toBe(DEV_BACKEND_URL);
    expect(DEV_BACKEND_URL).toBe('http://localhost:4000/graphql');
  });

  it('falls back to localhost when NODE_ENV is test', () => {
    expect(resolveBackendUrl({ NODE_ENV: 'test' })).toBe(DEV_BACKEND_URL);
  });

  it('throws when BACKEND_URL is unset in production', () => {
    expect(() => resolveBackendUrl({ NODE_ENV: 'production' })).toThrow(/BACKEND_URL is required/);
  });

  it('throws when BACKEND_URL is unset and NODE_ENV is missing', () => {
    expect(() => resolveBackendUrl({})).toThrow(/BACKEND_URL is required/);
  });

  it('does not treat non-exact NODE_ENV values as development', () => {
    expect(() => resolveBackendUrl({ NODE_ENV: 'Development' })).toThrow(/BACKEND_URL is required/);
    expect(() => resolveBackendUrl({ NODE_ENV: 'staging' })).toThrow(/BACKEND_URL is required/);
  });

  it('treats an empty BACKEND_URL as unset', () => {
    expect(() => resolveBackendUrl({ BACKEND_URL: '   ', NODE_ENV: 'production' })).toThrow(/BACKEND_URL is required/);
  });

  it('rejects a malformed BACKEND_URL', () => {
    expect(() => resolveBackendUrl({ BACKEND_URL: 'not a url', NODE_ENV: 'production' })).toThrow(/not a valid URL/);
  });

  it('rejects a non-http BACKEND_URL', () => {
    expect(() => resolveBackendUrl({ BACKEND_URL: 'ftp://x/graphql', NODE_ENV: 'production' })).toThrow(/http or https/);
  });
});

describe('resolveSubgraphs', () => {
  const names = (env: NodeJS.ProcessEnv) => resolveSubgraphs(env).map((s) => s.name);

  it('defaults to the monolith plus self-contained app/* subgraphs (no physio)', () => {
    const subgraphs = resolveSubgraphs({ BACKEND_URL: 'http://armanfit-backend:80/graphql', NODE_ENV: 'production' });
    expect(subgraphs).toEqual([
      { name: 'backend', url: 'http://armanfit-backend:80/graphql' },
      { name: 'activity', url: 'http://activity-subgraph:4005/graphql' },
      { name: 'social', url: 'http://social-subgraph:4006/graphql' },
      { name: 'live', url: 'http://live-subgraph:4017/graphql' },
    ]);
  });

  it('never includes the removed legacy service subgraphs', () => {
    const removed = ['users', 'coaches', 'nutrition', 'content', 'payments', 'courses', 'challenges', 'rewards'];
    const found = names({ BACKEND_URL: 'http://armanfit-backend:80/graphql', NODE_ENV: 'production' });
    removed.forEach((n) => expect(found).not.toContain(n));
    expect(found).not.toContain('physio');
  });

  it('honours per-subgraph URL overrides', () => {
    const subgraphs = resolveSubgraphs({
      BACKEND_URL: 'http://b/graphql',
      NODE_ENV: 'production',
      ACTIVITY_URL: 'http://act:9/graphql',
    });
    expect(subgraphs.find((s) => s.name === 'activity')?.url).toBe('http://act:9/graphql');
  });

  it('uses SUBGRAPHS_JSON verbatim when set, without requiring BACKEND_URL', () => {
    const json = JSON.stringify([{ name: 'x', url: 'http://x/graphql' }]);
    expect(resolveSubgraphs({ SUBGRAPHS_JSON: json, NODE_ENV: 'production' })).toEqual([{ name: 'x', url: 'http://x/graphql' }]);
  });

  it('fails fast in production when BACKEND_URL is missing', () => {
    expect(() => resolveSubgraphs({ NODE_ENV: 'production' })).toThrow(/BACKEND_URL is required/);
  });

  it('builds a local default list in development', () => {
    expect(names({ NODE_ENV: 'development' })[0]).toBe('backend');
    expect(resolveSubgraphs({ NODE_ENV: 'development' })[0].url).toBe(DEV_BACKEND_URL);
  });
});

describe('SUBGRAPHS_JSON validation', () => {
  const run = (json: string) => resolveSubgraphs({ SUBGRAPHS_JSON: json, NODE_ENV: 'production' });
  it('rejects malformed JSON, empty or non-array values', () => {
    expect(() => run('{')).toThrow(/not valid JSON/);
    expect(() => run('[]')).toThrow(/non-empty array/);
    expect(() => run('{"name":"x"}')).toThrow(/non-empty array/);
  });
  it('rejects non-http(s) urls, bad names and duplicates', () => {
    expect(() => run(JSON.stringify([{ name: 'x', url: 'file:///etc/passwd' }]))).toThrow(/http or https/);
    expect(() => run(JSON.stringify([{ name: 'x', url: 'not a url' }]))).toThrow(/valid URL/);
    expect(() => run(JSON.stringify([{ name: '', url: 'http://x/graphql' }]))).toThrow(/invalid name/);
    expect(() =>
      run(JSON.stringify([{ name: 'x', url: 'http://a/graphql' }, { name: 'x', url: 'http://b/graphql' }])),
    ).toThrow(/duplicate/);
  });
  it('rejects a non-http ACTIVITY_URL', () => {
    expect(() => resolveSubgraphs({ NODE_ENV: 'test', ACTIVITY_URL: 'gopher://x' })).toThrow(/ACTIVITY_URL/);
  });
});
