# ENVIRONMENT Matrix

| Variable | Dev | Stage | Prod | Notes |
|---------|-----|-------|------|------|
| NODE_ENV | development | staging | production |  |
| PORT | 4000 | 4000 | 4000 | Backend port |
| DATABASE_URL | postgres://dev:dev@localhost:5432/armanfit | **Secret** | **Secret** | Use External Secrets |
| JWT_ACCESS_SECRET | dev-secret-please-change | **Secret** | **Secret** | rotate regularly |
| JWT_REFRESH_SECRET | dev-secret-please-change | **Secret** | **Secret** | rotate regularly |
| JWT_ISSUER | armanfit | armanfit | armanfit |  |
| JWT_AUDIENCE | armanfit-users | armanfit-users | armanfit-users |  |
| JWT_EXPIRES_IN | 1d | 1d | 1d |  |
| ENABLE_GRAPHQL_PLAYGROUND | true | false | false |  |
| ENABLE_GRAPHQL_INTROSPECTION | true | false | false |  |
| GRAPHQL_DEPTH_LIMIT | 8 | 8 | 8 |  |
| REDIS_URL | redis://localhost:6379 | **Secret** | **Secret** |  |

Kubernetes: `ExternalSecret` → Secret `armanfit-backend-env` → `envFrom.secretRef` در Deployment.
