# Security & Secrets Hardening
Date: 2025-08-12T11:48:59.647542Z

## What we did
- Removed all `.env.production` files from the repository.
- Enforced ignoring env files in `.gitignore` (kept `.env.example` tracked).
- Added `README_SECRETS.md` with guidance for **GitHub Secrets** and **Kubernetes External Secrets**.
- Patched GitHub Actions with a commented hint block (`## SECRETS_ENV`) to map secrets safely.

## Notes
- Git history was not rewritten. If any real secret was committed in the past, rotate it and consider history rewrite.
- Helm charts now support External Secrets; see `values.production.yaml` samples.
