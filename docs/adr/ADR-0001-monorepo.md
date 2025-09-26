# ADR-0001: Monorepo with pnpm, Node 20, TS Strict

- Status: accepted
- Date: 2025-08-24
- Authors: Architecture Guild

## Context
We need a scalable monorepo for web, mobile, and backend.

## Decision
Use pnpm workspaces, Node 20.x, and TypeScript strict across all packages.

## Consequences
+ Fast installs, deduped deps, shared scripts
- Requires CI and lint guardrails (added in Phase 0-3)
