import http from 'node:http';

/**
 * Minimal bootstrap for media-worker (placeholder).
 * TODO: integrate actual queue/consumer logic.
 */
console.log('[media-worker] starting...');
process.on('SIGTERM', () => { console.log('[media-worker] SIGTERM'); process.exit(0); });

// Basic liveness/readiness endpoints (no framework dependency)
const port = Number(process.env.PORT || 0);
if (port) {
  const server = http.createServer((req, res) => {
    if (req.url === '/healthz') return res.writeHead(200).end(JSON.stringify({ ok: true }));
    if (req.url === '/readyz') return res.writeHead(200).end(JSON.stringify({ ready: true }));
    res.writeHead(404).end();
  });
  server.listen(port, () => console.log(`[media-worker] health server on :${port}`));
}
