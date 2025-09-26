# Admin & Privacy Checklist (Phase G)
- [ ] RBAC scopes verified for admin-only routes (roles: admin, coach, support)
- [ ] Sensitive fields redacted in logs & responses (`redactSensitive` in `src/common/redact.ts`)
- [ ] Correlation-Id propagated to downstream services (header: `X-Correlation-Id`)
- [ ] Security headers enabled via `helmet`
- [ ] CORS restricted via `CORS_ORIGIN` env
- [ ] Audit trail for role changes & data deletions (TODO: wire DB model / events)
- [ ] GDPR "Right to Erasure" flow documented (controller stub optional)
