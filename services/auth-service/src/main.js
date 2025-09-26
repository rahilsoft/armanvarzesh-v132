
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';

const app = Fastify();
await app.register(cors, { origin: true, credentials: true });

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const sign = (payload)=> jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

app.post('/auth/login', async (req, reply)=>{
  const { email, role='user', userId } = req.body||{};
  const sub = userId || email || 'user-'+Math.random().toString(36).slice(2,8);
  const token = sign({ sub, role });
  return { access_token: token, token_type: process.env.TOKEN || "changeme"/auth/verify', async (req, reply)=>{
  const b = (req.headers['authorization']||'').toString();
  if (!b.startsWith('Bearer ')) return reply.code(401).send({ ok:false });
  try{
    const d = jwt.verify(b.slice(7), JWT_SECRET);
    return { ok:true, ...d };
  }catch(e){ return reply.code(401).send({ ok:false }); }
});

const port = process.env.PORT||4000;
app.listen({ port, host:'0.0.0.0' }).then(()=> console.log('auth-service on', port));
