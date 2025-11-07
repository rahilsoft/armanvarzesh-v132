# GraphQL Federation v2 Gateway

Apollo Federation v2 gateway for the Arman platform microservices.

## Architecture

This gateway composes 8 subgraphs into a unified GraphQL API:

### Core Subgraphs (app/)
- `activity-subgraph` - Activity rings, training load, awards
- `social-subgraph` - Social features, feeds, interactions
- `physio-subgraph` - Physiotherapy sessions and assessments
- `live-subgraph` - Live streaming and virtual classes

### Service Subgraphs (services/)
- `users-service` - User management and profiles
- `coaches-service` - Coach management and matching
- `nutrition-service` - Nutrition plans and meal tracking
- `content-service` - Content management, exercises, tiles

## Features

✅ **Federation v2** with entity resolution via `@key`
✅ **JWT Propagation** to all subgraphs
✅ **Security Hardening** (Helmet, CSP, CORS, Rate Limiting)
✅ **Health & Readiness** probes
✅ **Observability** via OpenTelemetry
✅ **Production-Ready** Docker image with non-root user

## Getting Started

### Prerequisites
- Node.js 20+
- Access to all subgraph services
- PostgreSQL (for some subgraphs)

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set environment variables:**
   ```bash
   export PORT=4010
   export NODE_ENV=development

   # Subgraph URLs (update to your local/dev URLs)
   export ACTIVITY_URL=http://localhost:4005/graphql
   export SOCIAL_URL=http://localhost:4006/graphql
   export PHYSIO_URL=http://localhost:4016/graphql
   export LIVE_URL=http://localhost:4017/graphql
   export USERS_URL=http://localhost:4001/graphql
   export COACHES_URL=http://localhost:4008/graphql
   export NUTRITION_URL=http://localhost:4013/graphql
   export CONTENT_URL=http://localhost:4014/graphql
   ```

3. **Start the gateway:**
   ```bash
   pnpm dev
   ```

4. **Access GraphQL Playground:**
   ```
   http://localhost:4010/graphql
   ```

### Docker Build

```bash
# Build image
docker build -t graphql-gateway:latest .

# Run container
docker run -p 4010:4010 \
  -e ACTIVITY_URL=http://activity-subgraph:4005/graphql \
  -e SOCIAL_URL=http://social-subgraph:4006/graphql \
  graphql-gateway:latest
```

### Kubernetes Deployment

```bash
# Install Helm chart
helm install graphql-gateway ../../helm/graphql-gateway \
  --namespace arman \
  --create-namespace

# Check deployment
kubectl -n arman get pods -l app.kubernetes.io/name=graphql-gateway
kubectl -n arman logs -l app.kubernetes.io/name=graphql-gateway -f

# Port-forward to test locally
kubectl -n arman port-forward svc/graphql-gateway 4010:4010
```

## Entity Resolution

The gateway supports Federation entity resolution. Example:

```graphql
# Query User with fields from multiple subgraphs
query GetUserActivity {
  user(id: "123") {
    # From users-service
    id
    email
    name

    # From activity-subgraph
    activityRings {
      date
      moveKcal
      progress {
        movePct
      }
    }

    # From activity-subgraph
    loadSummary {
      recent7
      recent28
      state
    }
  }
}
```

## Adding a New Subgraph

1. **Update main.ts with new subgraph:**
   ```typescript
   const SUBGRAPHS = [
     // ... existing subgraphs
     { name:'workouts', url: process.env.WORKOUTS_URL || 'http://workouts-service:4020/graphql' },
   ];
   ```

2. **Add environment variable to Helm values:**
   ```yaml
   env:
     - name: WORKOUTS_URL
       value: "http://workouts-service:4020/graphql"
   ```

3. **Ensure subgraph uses @apollo/subgraph:**
   ```typescript
   import { buildSubgraphSchema } from '@apollo/subgraph';

   const schema = buildSubgraphSchema({ typeDefs, resolvers });
   ```

4. **Define entities with @key:**
   ```graphql
   type User @key(fields: "id") {
     id: ID!
     workouts: [Workout!]!
   }
   ```

## Health Checks

- **Liveness:** `GET /health` - Always returns 200 if process is alive
- **Readiness:** `GET /ready` - Returns 200 when gateway has loaded subgraphs

## Monitoring

Prometheus metrics are exposed at `/metrics` (if prom-client is configured).

Key metrics:
- Request rate and latency
- Error rate
- Active connections
- Subgraph query performance

## Security

### CORS
Configured via `CORS_ORIGINS` environment variable (comma-separated):
```bash
CORS_ORIGINS=https://arman.app,https://admin.arman.app
```

### CSP (Content Security Policy)
Enable nonce mode with:
```bash
CSP_NONCE_MODE=1
```

### Rate Limiting
User-aware rate limiting is enabled via `@arman/security-middleware`.

### JWT Verification
JWTs are verified at the gateway level and propagated to subgraphs via the `authorization` header.

## Troubleshooting

### Gateway fails to start
- Check that all subgraph URLs are accessible
- Verify subgraphs are running and expose GraphQL at `/graphql`
- Check logs: `docker logs <container>` or `kubectl logs <pod>`

### Queries fail with "Cannot query field"
- Subgraph may not be registered correctly
- Field may not be defined in any subgraph schema
- Check gateway logs for schema composition errors

### Slow queries
- Enable DataLoader in subgraphs to avoid N+1 queries
- Consider adding `@defer` for non-critical fields
- Use persisted queries to reduce parsing overhead

## Development Tips

1. **Test subgraph independently:**
   ```bash
   curl -X POST http://localhost:4005/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"{ __typename }"}'
   ```

2. **Introspect composed schema:**
   ```graphql
   query IntrospectionQuery {
     __schema {
       types {
         name
       }
     }
   }
   ```

3. **Check Federation directives:**
   ```graphql
   query CheckDirectives {
     __schema {
       directives {
         name
         locations
       }
     }
   }
   ```

## Related Documentation

- [ADR-002: GraphQL Federation v2](../../docs/adr/ADR-002-graphql-federation-v2.md)
- [Apollo Federation Docs](https://www.apollographql.com/docs/federation/)
- [Helm Chart](../../helm/graphql-gateway/)

## Support

For issues or questions:
- Check logs first
- Review Federation docs
- Open an issue in the repository
