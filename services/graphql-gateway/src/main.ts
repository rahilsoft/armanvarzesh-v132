import '@arman/observability-sdk/register';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware, applyBasicHardening } from '@arman/security-middleware';
import http from 'http'; import express from 'express'; import cors from 'cors'; import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server'; import { expressMiddleware } from '@as-integrations/express4';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { resolveSubgraphs } from './subgraphs.js';

// Federation v2 subgraphs configuration
// Each subgraph must expose @apollo/subgraph directives (@key, @shareable, etc.)
// Default: the monolith (BACKEND_URL) plus activity/social/live. Throws at startup if
// BACKEND_URL is missing outside development/test.
const SUBGRAPHS = resolveSubgraphs(process.env);

class JwtDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: any) {
    if (context?.authHeader) request.http?.headers.set('authorization', context.authHeader);
  }
}

async function bootstrap(){
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(buildJwtVerifier() as any);
  app.use(buildUserAwareRateLimit() as any);
  if (process.env.CSP_NONCE_MODE==='1') app.use(cspMiddleware({mode:'nonce'}) as any);
  applyBasicHardening(app);

  // Health and readiness endpoints
  app.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'graphql-gateway',
      version: process.env.VERSION || 'dev',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  app.get('/ready', async (_req, res) => {
    try {
      // Check if gateway is ready (has loaded subgraphs)
      const loaded = gateway.executor !== null;
      if (!loaded) {
        return res.status(503).json({ ok: false, error: 'Gateway not ready' });
      }
      res.json({
        ok: true,
        subgraphs: SUBGRAPHS.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({ ok: false, error: String(error) });
    }
  });

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({ subgraphs: SUBGRAPHS }),
    buildService: ({url}) => new JwtDataSource({ url })
  });

  const server = new ApolloServer({ gateway, includeStacktraceInErrorResponses: false });
  await server.start();
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({
      authHeader: req.headers['authorization'] || ''
    })
  }));

  const httpServer = http.createServer(app);
  const port = Number(process.env.PORT || 4000);
  httpServer.listen(port, ()=> console.log(`graphql-gateway up on :${port}`));
}
bootstrap().catch((e)=>{ console.error(e); process.exit(1); });
