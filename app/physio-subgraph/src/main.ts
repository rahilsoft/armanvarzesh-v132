import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware, applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import http from 'http'; import express from 'express'; import cors from 'cors'; import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server'; import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema'; import { resolvers } from './resolvers';
import helmet from 'helmet';

async function bootstrap(){
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Security & RateLimit & CSP
  app.use(helmet());
  app.use(buildJwtVerifier());
  app.use(buildUserAwareRateLimit());
  if (process.env.CSP_NONCE_MODE==='1') app.use(cspMiddleware({mode:'nonce'}));

  applyBasicHardening(app);
  app.get('/health', (_req,res)=> res.json({ ok:true, service: 'physio-subgraph' }));

  const server = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  const httpServer = http.createServer(app);
  const port = Number(process.env.PORT || 4016);
  httpServer.listen(port, ()=> console.log(`physio-subgraph up on :${port}`));
}
bootstrap().catch((e)=>{ console.error(e); process.exit(1); });
