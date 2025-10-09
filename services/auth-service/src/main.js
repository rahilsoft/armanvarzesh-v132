import Fastify from 'fastify';
import cors from '@fastify/cors';
import { buildKeyStore } from './jwt.js';

const app = Fastify();
await app.register(cors, { origin: true, credentials: true });

let keyStore;
try {
  keyStore = await buildKeyStore(process.env);
} catch (err) {
  console.error('Failed to initialize JWT keystore', err);
  process.exit(1);
}

app.get('/.well-known/jwks.json', async () => keyStore.jwks);

app.post('/auth/login', async (req, _reply) => {
  const { email, role = 'user', userId } = req.body || {};
  const sub = userId || email || `user-${Math.random().toString(36).slice(2, 10)}`;
  const token = await keyStore.sign({ sub, role });
  return {
    access_token: token,
    token_type: 'Bearer',
    expires_in: keyStore.ttlSeconds,
    kid: keyStore.activeKid,
  };
});

app.get('/auth/verify', async (req, reply) => {
  const auth = (req.headers['authorization'] || '').toString();
  if (!auth.startsWith('Bearer ')) {
    return reply.code(401).send({ ok: false });
  }
  try {
    const { payload, protectedHeader } = await keyStore.verify(auth.slice(7));
    return { ok: true, kid: protectedHeader.kid, ...payload };
  } catch (err) {
    return reply.code(401).send({ ok: false });
  }
});

const port = process.env.PORT || 4000;
app.listen({ port, host: '0.0.0.0' }).then(() => console.log('auth-service on', port));
