
# Secrets Migration Plan
Date: 2025-08-12T11:47:39.731150Z

## Objective
Remove sensitive environment variables from the repository and store them in secure secret management systems.

## Actions Taken
- Removed all `.env.production` files from the repo.
- Added `.env.production` to `.gitignore` to prevent future commits.
- This ensures secrets are not committed to version control.

## Next Steps
### 1. GitHub Secrets (CI/CD)
- Go to your repository **Settings > Secrets and variables > Actions**.
- Create the following secrets (example list, adjust per service):
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `RABBITMQ_URL`
  - `REDIS_HOST`
  - `MINIO_ENDPOINT`
  - `MINIO_ROOT_USER`
  - `MINIO_ROOT_PASSWORD`
- Update GitHub Actions workflows to use these secrets via `secrets.<NAME>`.

### 2. Kubernetes Secrets
- Use **External Secrets Operator** (preferred) or native K8s Secrets.
- For External Secrets:
  ```yaml
  apiVersion: external-secrets.io/v1beta1
  kind: ExternalSecret
  metadata:
    name: armanfit-backend-env
  spec:
    secretStoreRef:
      name: global-secrets-store
      kind: ClusterSecretStore
    target:
      name: armanfit-backend-env
    data:
      - secretKey: DATABASE_URL
        remoteRef:
          key: prod/armanfit/DATABASE_URL
      - secretKey: JWT_SECRET
        remoteRef:
          key: prod/armanfit/JWT_SECRET
      - secretKey: RABBITMQ_URL
        remoteRef:
          key: prod/armanfit/RABBITMQ_URL
      - secretKey: REDIS_HOST
        remoteRef:
          key: prod/armanfit/REDIS_HOST
      - secretKey: MINIO_ENDPOINT
        remoteRef:
          key: prod/armanfit/MINIO_ENDPOINT
      - secretKey: MINIO_ROOT_USER
        remoteRef:
          key: prod/armanfit/MINIO_ROOT_USER
      - secretKey: MINIO_ROOT_PASSWORD
        remoteRef:
          key: prod/armanfit/MINIO_ROOT_PASSWORD
  ```
- Apply per environment (dev/staging/prod) with correct remoteRef keys.

### 3. Local Development
- Developers should use `.env.local` (not committed) for local overrides.
- Populate from a secure source or password manager.

## Security Notes
- Never commit `.env.production` or sensitive config files to version control.
- Use separate secrets per environment (dev, staging, prod).
- Rotate secrets periodically and on employee offboarding.
