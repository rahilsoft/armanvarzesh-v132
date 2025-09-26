import { describe, it, expect } from 'vitest';
import { buildSchema, findBreakingChanges } from 'graphql';
import { readFileSync } from 'fs';

// Compare built schema (dist) with baseline contract
describe('GraphQL Contract', () => {
  it('should have no breaking changes vs baseline', async () => {
    const baseline = readFileSync('contracts/graphql/schema.gql', 'utf8');
    // The built schema is emitted under app/backend/dist/schema.gql after `pnpm -C app/backend build`.
    // Using the app/ path instead of apps/ to match the current monorepo layout.
    const current = readFileSync('app/backend/dist/schema.gql', 'utf8');
    const changes = findBreakingChanges(buildSchema(baseline), buildSchema(current));
    expect(changes.length).toBe(0);
  });
});
