# Phase 6 — Apollo Driver Injection + E2E Scaffolding
Date: 2025-08-18

- Injected `ApolloDriver`/`ApolloDriverConfig` into `GraphQLModule.forRoot[Async]` calls and added import from `@nestjs/apollo`.
- Ensured `@nestjs/apollo` dependency in `app/backend/package.json`.
- Added **e2e test scaffolding** (skipped by default) in `app/backend/e2e/` for Auth and Payments.

> Non-breaking: existing boot remains; when you upgrade Nest GraphQL to v12, ApolloDriver config is ready.
