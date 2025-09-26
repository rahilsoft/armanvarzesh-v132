# ADR-0002: Security — JWT Rotation & CORS Allowlist

## Status
Accepted

## Context
Repository needs strong key management and strict cross-origin policy.

## Decision
- JWT keys stored in KMS/Vault, rotated every 30 days; `kid` header enabled.
- CORS allowlist per environment; credentials only for trusted origins.

## Consequences
- Lower breach risk; auditable keys; fewer CSRF/CORS issues.
