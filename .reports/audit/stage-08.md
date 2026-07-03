# Stage 08 — GraphQL Audit

**Source of truth:** repository only.

---

## Inventory (verified)
- `@Resolver`/`@ResolveField`: **71** files.
- DataLoader references: **66** files (`grep DataLoader|dataloader`).
- Subgraph schemas (`@key`/`buildSubgraphSchema`): `app/activity-subgraph`, `app/social-subgraph`, `app/physio-subgraph`, `app/live-subgraph`, plus `services/*`.
- Subscriptions/PubSub: `services/chat-service`, `app/backend/src/chat`, `app/backend/src/notifications`.
- Federation gateway: `services/graphql-gateway/src/main.ts` (`ApolloGateway` + `IntrospectAndCompose`).

---

## Findings

### P1-01 — Gateway composition omits most subgraphs (see Stage 02 P1-02)
**Evidence:** `services/graphql-gateway/src/main.ts:10-20` default `SUBGRAPHS` lists only 8; dozens of resolver-bearing services are not composed.
**Why it is a problem:** Either the omitted subgraphs' schemas are dead, or federated queries against them 404 at the gateway. Schema is not a single verified supergraph.
**Production impact:** Missing query capability or dead schema.
**Recommended fix:** CI supergraph compose (`rover supergraph compose`) gating on the full subgraph list.
**Effort:** M. **Risk:** Medium.

### P1-02 — `IntrospectAndCompose` at runtime (production anti-pattern)
**Evidence:** `services/graphql-gateway/src/main.ts` imports and uses `IntrospectAndCompose`.
**Why it is a problem:** `IntrospectAndCompose` polls subgraphs at boot to build the supergraph. In production this makes gateway startup depend on every subgraph being up, introduces composition-time failures at deploy, and prevents schema pinning. Apollo recommends static supergraph SDL in prod.
**Production impact:** Gateway fails to start if any subgraph is down; no schema pinning → surprise breaking changes.
**Recommended fix:** Build a static supergraph in CI; load `supergraphSdl` in prod.
**Effort:** M. **Risk:** Medium.

### P2-03 — Authorization done ad hoc inside resolvers via untyped context (couples to Stage 05 P0-01)
**Evidence:** `services/content-service/src/plan/plan.resolver.ts:61-62` — role/user derived from `ctx:any` with header fallback; no field-level `@Directive`/guard. 8 content resolvers repeat this.
**Why it is a problem:** No centralized GraphQL authorization layer; each resolver re-implements identity extraction (insecurely). N resolvers = N chances to leak.
**Production impact:** Inconsistent/bypassable field authorization.
**Recommended fix:** Central auth via context builder that only trusts verified JWT; field guards/directives.
**Effort:** M. **Risk:** High.

### P2-04 — N+1 risk: DataLoader present but not uniformly applied
**Evidence:** 66 files reference DataLoader but 71 resolver files exist and `app/backend/src/dataloader.ts` is a single shared loader; many `@ResolveField` resolvers in `services/*` fetch per-parent with `prisma.findUnique` inside the resolver (pattern seen in payments/`mySub` and content resolvers).
**Why it is a problem:** Any `@ResolveField` doing a per-row Prisma call without a batching loader is a classic N+1.
**Production impact:** Query amplification under list queries → DB overload at scale.
**Recommended fix:** Enforce DataLoader for all relational field resolvers; add query-count assertions in tests.
**Effort:** M. **Risk:** Medium.

### P3-05 — Subscriptions use in-memory PubSub
**Evidence:** `app/backend/src/chat/pubsub.provider.ts` and chat resolvers rely on a `PubSub` instance (in-memory) rather than a Redis/broker-backed PubSub.
**Why it is a problem:** In-memory PubSub does not fan out across replicas; subscriptions break under horizontal scaling.
**Production impact:** Missed real-time messages when >1 pod.
**Recommended fix:** `graphql-redis-subscriptions` or broker-backed transport.
**Effort:** M. **Risk:** Medium.

---

## Positives (verified)
- DataLoader is a known pattern here (66 files), not absent.
- Federation directives and subgraph schemas exist and are structured.
- Gateway propagates auth header to subgraphs (`JwtDataSource`).

## Stage score: **52/100** (GraphQL)
