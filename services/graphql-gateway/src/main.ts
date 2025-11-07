import '@arman/observability-sdk/register';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware, applyBasicHardening } from '@arman/security-middleware';
import http from 'http'; import express from 'express'; import cors from 'cors'; import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server'; import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

// Federation v2 subgraphs configuration
// Each subgraph must expose @apollo/subgraph directives (@key, @shareable, etc.)
const SUBGRAPHS = JSON.parse(process.env.SUBGRAPHS_JSON || JSON.stringify([
  // Core subgraphs (app/)
  { name:'activity',  url: process.env.ACTIVITY_URL  || 'http://activity-subgraph:4005/graphql' },
  { name:'social',    url: process.env.SOCIAL_URL    || 'http://social-subgraph:4006/graphql' },
  { name:'physio',    url: process.env.PHYSIO_URL    || 'http://physio-subgraph:4016/graphql' },
  { name:'live',      url: process.env.LIVE_URL      || 'http://live-subgraph:4017/graphql' },

  // Service subgraphs (services/)
  { name:'users',     url: process.env.USERS_URL     || 'http://users-service:4001/graphql' },
  { name:'coaches',   url: process.env.COACHES_URL   || 'http://coaches-service:4008/graphql' },
  { name:'nutrition', url: process.env.NUTRITION_URL || 'http://nutrition-service:4013/graphql' },
  { name:'content',   url: process.env.CONTENT_URL   || 'http://content-service:4014/graphql' },
]));

class JwtDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: any) {
    if (context?.authHeader) request.http?.headers.set('authorization', context.authHeader);
  }
}

async function bootstrap(){
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(buildJwtVerifier());
  app.use(buildUserAwareRateLimit());
  if (process.env.CSP_NONCE_MODE==='1') app.use(cspMiddleware({mode:'nonce'}));
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
