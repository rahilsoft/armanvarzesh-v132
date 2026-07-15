import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import http from 'http'; import express from 'express'; import cors from 'cors'; import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server'; import { expressMiddleware } from '@as-integrations/express4'; import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs, resolvers } from './schema';
async function bootstrap(){ const app = express(); app.use(cors()); app.use(bodyParser.json());
app && app.use(buildJwtVerifier() as any);
app && app.use(buildUserAwareRateLimit() as any);
process.env.CSP_NONCE_MODE==='1' && app.use(cspMiddleware({mode:'nonce'}) as any);


app && applyBasicHardening(app);
  app.get('/health', (_req,res)=> res.json({ok:true, service:'social-subgraph'}));
  const server = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) }); await server.start();
  app.use('/graphql', expressMiddleware(server) as any); const httpServer = http.createServer(app); const port = Number(process.env.PORT || 4006);
  httpServer.listen(port, ()=> console.log(`social-subgraph up on :${port}`)); }
bootstrap().catch((e)=>{ console.error(e); process.exit(1); });

