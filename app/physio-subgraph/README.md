# Physio Subgraph (Apollo Federation)

Exposes physio plan/progress and mutations over GraphQL by proxying the `physio-service` REST API.

## ENV
- `PHYSIO_SERVICE_URL` (default `http://localhost:4061`)
- `PORT` (default `4016`)

## Dev
```bash
pnpm -F @arman/physio-subgraph build && pnpm -F @arman/physio-subgraph start
# GraphQL: http://localhost:4016/graphql
```
