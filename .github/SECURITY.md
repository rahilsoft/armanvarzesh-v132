# Security Policy

## Supported Versions
We support security fixes on the default branch.

## Reporting a Vulnerability
Please report (non-publicly) via rahilsoft@live.com. We will acknowledge within 48 hours.

## Handling Secrets
- No real secrets in the repository.
- Use environment variables provided by Secret Manager (e.g., Vault/KMS).
- Rotate JWT keys regularly and use `kid` header.
