/**
 * Origin check for the gateway. Requests without an Origin header (same-origin,
 * server-to-server, mobile apps) pass; browsers must be on the allowlist.
 * An empty allowlist denies all cross-origin browser traffic.
 */
export function corsOriginCheck(env: NodeJS.ProcessEnv = process.env) {
  const list = (env.CORS_ORIGINS || env.CORS_ORIGIN || env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || list.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  };
}
