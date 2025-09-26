# Release Candidate Checklist (Dry)

## Gaps (must be zero before Release)
- UNRESOLVED_CLIENT_CALLS: 46
- UNRESOLVED_CLIENT_OPERATIONS: 70
- UNUSED_SERVER_ROUTES: 196 (marked deprecated in Stage 17)
- UNUSED_GRAPHQL_OPERATIONS: 6 (marked deprecated in Stage 19)

## Environment Samples
- Status: Completed in Stage 21 per report

## Dependency Graph
- Circular dependencies detected: YES
  - Nodes: @arman/storage, @arman/service-kit, @arman/awards-engine, @arman/ui, @arman/http-client, @arman/state, @arman/async-utils, @arman/integration, @arman/env-config, @arman/integrations-livekit, @arman/ui-components, @arman/observability, @arman/training-load-engine, @arman/utils, @arman/ui-tokens
