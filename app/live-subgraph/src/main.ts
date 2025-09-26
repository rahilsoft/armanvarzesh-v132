import { buildJwtVerifier, buildUserAwareRateLimit, cspMiddleware } from '@arman/security-middleware';
import { applyBasicHardening } from '@arman/security-middleware';
import '@arman/observability-sdk/register';
import helmet from "helmet";

import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs, resolvers } from './schema';
import { Server as IOServer } from 'socket.io';

async function bootstrap(){
  const app = express();
app && app.use(buildJwtVerifier());
app && app.use(buildUserAwareRateLimit());
process.env.CSP_NONCE_MODE==='1' && app.use(cspMiddleware({mode:'nonce'}));


app && applyBasicHardening(app);
  app.use(cors());
  app.use(bodyParser.json());
  app.get('/health', (_req,res)=> res.json({ok:true, service:'live-subgraph'}));

  const httpServer = http.createServer(app);
  // Socket.IO: basic signaling for chat/reactions & counter
  const io = new IOServer(httpServer, { cors: { origin: (process.env.CORS_ORIGIN || "").split(",").filter(Boolean) } });
  const counts = new Map<string, number>();
  io.on('connection', (socket)=>{
    let rid = ''; let uid = '';
    socket.on('join', ({ roomId, userId })=>{
      rid = roomId; uid = userId;
      socket.join(rid);
      counts.set(rid, (counts.get(rid)||0)+1);
      io.to(rid).emit('joined', { userId: uid });
      io.to(rid).emit('counter', { count: counts.get(rid) });
    });
    socket.on('leave', ()=>{
      if (rid){ socket.leave(rid); counts.set(rid, Math.max(0,(counts.get(rid)||1)-1)); io.to(rid).emit('left', { userId: uid }); io.to(rid).emit('counter', { count: counts.get(rid) }); }
    });
    socket.on('comment', ({ text })=>{ if (rid) io.to(rid).emit('comment', { userId: uid, text }); });
    socket.on('reaction', ({ emoji })=>{ if (rid) io.to(rid).emit('reaction', { userId: uid, emoji }); });
    socket.on('disconnect', ()=>{ if (rid){ counts.set(rid, Math.max(0,(counts.get(rid)||1)-1)); io.to(rid).emit('left', { userId: uid }); io.to(rid).emit('counter', { count: counts.get(rid) }); } });
  });

  const server = new ApolloServer({ schema: buildSubgraphSchema([{ typeDefs, resolvers }]) });
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  const port = Number(process.env.PORT || 4007);
  httpServer.listen(port, ()=> console.log(`live-subgraph up on :${port}`));
}
bootstrap().catch((e)=>{ console.error(e); process.exit(1); });


// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}
