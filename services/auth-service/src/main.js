import Fastify from 'fastify';
import cors from '@fastify/cors';
import { buildKeyStore } from './jwt.js';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true, credentials: true });

// Initialize keyStore once at startup
let keyStore;
try {
  keyStore = await buildKeyStore(process.env);
} catch (err) {
  console.error('Failed to initialize JWT keystore', err);
  process.exit(1);
}

// JWKS endpoint - public keys for token verification
app.get('/.well-known/jwks.json', async () => keyStore.jwks);

// Login endpoint - issues JWT tokens
app.post('/auth/login', async (req, _reply) => {
  const { email, role = 'user', userId } = req.body || {};
  const sub = userId || email || `user-${Math.random().toString(36).slice(2, 10)}`;

  try {
    const token = await keyStore.sign({ sub, role });
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: keyStore.ttlSeconds,
      kid: keyStore.activeKid,
    };
  } catch (err) {
    console.error('Token signing failed:', err);
    throw new Error('Failed to sign token');
  }
});

// Verify endpoint - validates JWT tokens
app.get('/auth/verify', async (req, reply) => {
  const auth = (req.headers['authorization'] || '').toString();
  if (!auth.startsWith('Bearer ')) {
    return reply.code(401).send({ ok: false, error: 'Missing or invalid authorization header' });
  }

  try {
    const { payload, protectedHeader } = await keyStore.verify(auth.slice(7));
    return { ok: true, kid: protectedHeader.kid, ...payload };
  } catch (err) {
    console.error('Token verification failed:', err);
    return reply.code(401).send({ ok: false, error: 'Invalid token' });
  }
});

// Health check endpoint
app.get('/health', async () => ({ status: 'ok', service: 'auth-service' }));

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`auth-service listening on port ${port}`);
});
