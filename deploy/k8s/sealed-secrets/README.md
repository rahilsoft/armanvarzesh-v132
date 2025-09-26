
# Sealed Secrets & Rotation Policy

- Rotate secrets quarterly (Q1/Q2/Q3/Q4) or upon incident.
- Use `kubeseal` with cluster public key; commit only sealed secrets.
- Keep short TTL for license keys; rotate JWT signing keys with key IDs (kid) and overlap validation windows for 24h.

## Example
kubectl create secret generic api-gateway --from-literal=JWT_SECRET=new-secret
kubeseal --format yaml <secret.yaml >sealed-api-gateway.yaml
