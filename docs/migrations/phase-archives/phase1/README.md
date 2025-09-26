# Phase 1 — Contracts & API Surface

This folder contains the canonical contracts for **Nutrition** and **Notifications**, OpenAPI specs for the initial API surface, and an isomorphic TypeScript SDK.

## What changed
- `@contracts/nutrition` and `@contracts/notifications` created under `packages/contracts/*`.
- `@contracts/feature` re-exports both contracts (non-breaking migration).
- OpenAPI specs: `docs/openapi/nutrition.v1.yaml` and `docs/openapi/notifications.v1.yaml`.
- `@arman/sdk` provides a tiny fetch-based client with typed responses.

## Next steps (Phase 2–3)
- Implement backend handlers for the defined endpoints with RBAC.
- Wire PWA and RN apps using `@arman/sdk` and feature flags for progressive rollout.
- Add contract/e2e tests in CI (Pact or schema assertions) and publish SDK.
