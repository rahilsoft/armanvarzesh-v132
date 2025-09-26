# Security Notes

This phase adds baseline hardening:
- **CSP** with self-only origins (styles/scripts allow 'unsafe-inline' temporarily — tighten with nonces).
- **SameSite=Lax** cookies for ambient session cookies.
- **RBAC** helpers and React `<Guard>` for feature/action checks.
- **Validation** tiny helpers for text/numbers.

## Next steps
- Replace inline styles/scripts with modules; enable CSP nonces/hashes and drop 'unsafe-inline'.
- Wire CSRF tokens for state-changing POSTs (already easy via custom header `X-CSRF`).
- Add server-side rate limiting and IP allowlists on BFF.
