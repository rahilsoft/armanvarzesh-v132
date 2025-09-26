# Release Engineering

## Changesets (Packages)
- Version & changelog via Changesets.
- Create a changeset locally:
  ```bash
  pnpm changeset
  pnpm version-packages   # bumps versions
  pnpm publish-packages   # requires NPM_TOKEN
  ```
- CI (`release.yml`) auto-creates a version PR or publishes when `NPM_TOKEN` is set.

## Containers (Services)
- `docker-publish.yml` discovers any `Dockerfile` and builds **multi-arch** (amd64, arm64)
- Images are pushed to **GHCR** with tag: `ghcr.io/<org>/<repo>:<path-hyphenated>-<sha>`
- Buildx uses GHA cache for speed; provenance generated via SLSA generic workflow.

## Supply-Chain
- **Gitleaks** secret scanning on PRs.
- **Env Guard** ensures only documented env keys are used (`env.allowed.json`).

## Recommended Secrets (in repo settings)
- `NPM_TOKEN` (optional, for Changesets publish)
- `GHCR` uses `GITHUB_TOKEN` automatically for pushes.