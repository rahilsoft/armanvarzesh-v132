# GraphQL Supergraph Gateway

Composes subgraphs (activity, social, physio) with JWT propagation and security middleware.

## ENV
- `SUBGRAPHS_JSON` (optional) or specific URLs:
  - `ACTIVITY_URL`, `SOCIAL_URL`, `PHYSIO_URL`
- `PORT` (default 4000)

## Dev
```bash
pnpm -F @arman/graphql-gateway build && pnpm -F @arman/graphql-gateway start
# GraphQL: http://localhost:4000/graphql
# Health:  http://localhost:4000/health
```
