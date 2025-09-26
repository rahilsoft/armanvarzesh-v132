# Hardening Notes (Automated)

This patch standardized Node 20 + pnpm, added unified CI, security toggles for GraphQL/CORS/rate-limit,
Dockerfile healthchecks, DataLoader scaffold, and observability package.

Follow-ups:
- Wire `LoaderRegistry` into GraphQL context.
- Merge `extraApolloConfig` into your Apollo driver options.
- Ensure Redis is available if enabling throttle/cache.
- Generate pnpm-lock.yaml in a CI run (`pnpm install`) before production.
