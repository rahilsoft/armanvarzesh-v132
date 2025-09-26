# ADR-0002: NestJS+GraphQL/REST, Prisma, Redis, BullMQ

- Status: accepted
- Date: 2025-08-24

## Decision
Standardize backend on NestJS with Prisma for PostgreSQL, Redis for cache/queue, BullMQ for jobs.

## Consequences
+ Strong modularity, decorators, DI
- Requires discipline to avoid circular deps; strict lint rules in place
