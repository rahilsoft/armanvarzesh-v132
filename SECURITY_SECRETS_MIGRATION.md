# Secrets & Security Hardening

Updated: 2025-08-12T11:48:29.421644Z

## What we changed
- Removed all `.env.production` files from the repository.
- Hardened `.gitignore` to prevent committing `.env*` files (except templates).
- Helm/K8s charts are configured to read environment via **External Secrets** (recommended) or fallback **Opaque Secret**.

## Where to store secrets

### GitHub Actions → GitHub Secrets / Environments
- Define these secrets under **Settings → Secrets and variables → Actions** (or under specific **Environments**):
  - `REGISTRY_USERNAME`
  - `REGISTRY_TOKEN`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `RABBITMQ_URL`
  - `REDIS_HOST`
  - `MINIO_ENDPOINT`
  - `MINIO_ROOT_USER`
  - `MINIO_ROOT_PASSWORD`
- Reference in workflows as `secrets.<NAME>`.

Example (build & push image with env passthrough):
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - run: pnpm -r install --frozen-lockfile=false

      - name: Login GHCR
        run: echo "${ secrets.REGISTRY_TOKEN }" | docker login ghcr.io -u "${ secrets.REGISTRY_USERNAME }" --password-stdin

      - name: Build & Push
        run: |
          IMAGE=ghcr.io/armanfit/backend:${ github.sha }
          docker build -t "$IMAGE" ./app/backend
          docker push "$IMAGE"
```

### Kubernetes → external-secrets / Secrets
- Preferred: **external-secrets.io** with a `ClusterSecretStore` (e.g., AWS Secrets Manager, GCP Secret Manager, Vault).
- Configure chart values (`values.production.yaml`) to map external secret keys:
  ```yaml
  externalSecrets:
    enabled: true
    secretStoreRef:
      name: global-secrets-store
      kind: ClusterSecretStore
    targetSecretName: armanfit-backend-env
    data:
      - secretKey: DATABASE_URL
        remoteRef: { key: prod/armanfit/DATABASE_URL }
      # ...
  ```
- Fallback: set `.Values.env` and `externalSecrets.enabled: false` to render a standard Opaque Secret.

## Local development
- Use `.env.example` files (non-sensitive) as templates. Create real `.env` locally but **do not commit**.
- `docker compose` and `helm` charts will mount secrets from K8s/External Secrets in non-local environments.
