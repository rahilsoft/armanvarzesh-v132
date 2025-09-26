    # CI/CD & Docs Normalization
    Date: 2025-08-12T12:09:38.262849Z

    ## Workflows
    - Standardized all workflows to **Node 20 + pnpm 9** with **cache: 'pnpm'**.
    - Replaced all `npm`/`bun install` usages with `pnpm -r install --frozen-lockfile=false`.
    - Ensured workspace-friendly `pnpm -r run <script>` for monorepo scripts.

    Files updated (12):
    - .github/workflows/preview-env.yml
- .github/workflows/openapi-export.yml
- .github/workflows/contracts.yml
- .github/workflows/publish-ghcr.yml
- .github/workflows/monorepo-turbo.yml
- .github/workflows/security-trivy-images.yml
- .github/workflows/backend-ci.yml
- .github/workflows/migrations.yml
- .github/workflows/security-trivy.yml
- .github/workflows/lighthouse.yml
- .github/workflows/sbom.yml
- .github/workflows/ci.yml

    ## install.sh
    - Rewrote legacy `install.sh` scripts to align with pnpm + compose + prisma migrations.

    Files updated (1):
    - install.sh

    ## docs/env-matrix.md
    - Rebuilt from current `.env.example` files to reflect the **actual** services/apps in this repo.
