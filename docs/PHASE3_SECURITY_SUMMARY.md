# Phase 3 — Security Hardening Summary
Date: 2025-08-18

## Changes Applied
- GraphQL playground/introspection now env-driven (off by default in production).
- Helmet added to backend main.ts.
- CORS now configurable via `CORS_ORIGINS` instead of `*`/`true`.
- K8s Pod Security and securityContext examples added in `k8s/security/`.

## Env
- `GRAPHQL_PLAYGROUND`, `GRAPHQL_INTROSPECTION`: 'true' to enable.
- `CORS_ORIGINS`: comma-separated list or `*`.
