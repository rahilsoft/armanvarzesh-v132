# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Users** domain now lives in the modular monolith at
`app/backend/src/users` (`UsersModule` / `UsersService` / `UsersResolver`),
per `.reports/architecture/DOMAIN-OWNERSHIP.md`.

The demographic/profile fields that this service added to `User`
(`age`, `gender`, `height`, `weight`, `goals`, `fitnessLevel`) have been folded
into the canonical `User` model (Int PKs) and are now persisted by the monolith
`UsersService.create/update` (the pre-fold monolith silently dropped them — a
data-loss bug this fold fixes). Covered by
`app/backend/src/users/__tests__/users.service.spec.ts`.

## Why this service is not yet deleted

Retirement is gated on runtime validation (CI, real Postgres) and infra rewire,
so nothing still routes to it:

- `services/graphql-gateway/src/main.ts` — `users` subgraph
  (`USERS_URL` → `users-service:4001/graphql`)
- `docker-compose.yml` — `USERS_SERVICE_URL: http://users-service:4001`

Once the monolith exposes the `users` subgraph/endpoint the gateway needs and
CI validates it, this directory will be removed in a dedicated retirement
commit. Do not add new features here.
