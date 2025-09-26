import request from 'supertest';

export type EndpointTry = {
  method: 'get' | 'post';
  base: string;
  paths: string[];
  body?: any;
  headers?: Record<string, string>;
  expectStatus?: number | number[];
};

export async function tryPaths({ method, base, paths, body, headers, expectStatus }: EndpointTry) {
  const statuses = Array.isArray(expectStatus) ? expectStatus : (expectStatus ? [expectStatus] : [200,201,204]);
  for (const p of paths) {
    const url = base + p;
    try {
      let r = method === 'post'
        ? await request(url).post('').set(headers || {}).send(body || {})
        : await request(url).get('').set(headers || {});
      if (statuses.includes(r.status)) {
        return { ok: true, pathTried: p, res: r };
      }
    } catch (e) {
      // ignore and continue
    }
  }
  return { ok: false, pathTried: null, res: null };
}

export function getEnv(name: string, fallback: string) {
  return process.env[name] || fallback;
}
