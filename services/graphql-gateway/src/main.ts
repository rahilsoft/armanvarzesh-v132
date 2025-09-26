import '@arman/observability-sdk/register';
import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware, applyBasicHardening } from '@arman/security-middleware';
import http from 'http'; import express from 'express'; import cors from 'cors'; import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server'; import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

const SUBGRAPHS = JSON.parse(process.env.SUBGRAPHS_JSON || JSON.stringify([
  { name:'activity', url: process.env.ACTIVITY_URL || 'http://localhost:4005/graphql' },
  { name:'social',   url: process.env.SOCIAL_URL   || 'http://localhost:4006/graphql' },
  { name:'physio',   url: process.env.PHYSIO_URL   || 'http://localhost:4016/graphql' },
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

  app.get('/health', (_req,res)=> res.json({ ok:true, service: 'graphql-gateway'}));

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
