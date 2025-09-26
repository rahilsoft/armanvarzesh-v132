import { describe, it, expect } from 'vitest';
import request from 'supertest';
import YAML from 'yaml';
import { readFileSync } from 'fs';
import { createApp } from '@arman/service-kit';

const spec = YAML.parse(readFileSync('contracts/openapi/sample.yaml', 'utf8'));

describe('OpenAPI contract — affiliate-service', () => {
  it('routes must conform to spec', async () => {
    const ctx = await createApp({ serviceName: 'affiliate-service' });
    for (const path of Object.keys(spec.paths)) {
      const res = await request(ctx.app).get(path);
      expect([200, 301, 302]).toContain(res.status);
      if (res.status === 200 && path === '/health') {
        expect(res.body.status).toBe('ok');
      }
      if (res.status === 200 && path === '/info') {
        expect(typeof res.body.service).toBe('string');
        expect(typeof res.body.version).toBe('string');
        expect(typeof res.body.time).toBe('string');
      }
    }
  });
});
