# Testing Plan

## Layers
1. Unit tests (services/controllers/resolvers)
2. Integration/E2E (`@nestjs/testing` + `supertest` / GraphQLModule)
3. Coverage via root `jest.config.ts`

## How to run
```bash
npm ci
npm test
```

## TODO
- Replace skeletons in `tests/e2e/*` with real scenarios.
- Add DB/queue mocks.
