# Admin RBAC & Audit — Wiring notes
- Guards/Interceptor are global, but **no-op unless metadata present**:
  - Use `@Roles('admin')` on handlers/classes to enforce RBAC.
  - Use `@DoubleConfirm()` on destructive actions (role change, delete, refund).
  - Use `@AuditAction('<name>')` to record audit trail entries.
- Set `AUDIT_LOG_PATH=/var/log/audit.log` in production to persist JSON lines.
