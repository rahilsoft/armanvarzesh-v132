# Required Checks (branch protection)
Mark these workflows as **required** for merging into `main`:

- Verify — typecheck • lint • test • build
- CodeQL — JS/TS
- Gitleaks — Secret scan
- E2E Web — Playwright (site)
- Lighthouse — site
- Docker Build + Trivy Scan

Also recommended:
- Release — semantic-release (protected to run on `main` only)
- Container Release — build • push • sign • sbom
