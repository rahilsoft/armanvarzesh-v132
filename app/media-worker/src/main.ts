import http from 'node:http';

/**
 * Minimal bootstrap for the media-worker (placeholder).
 * Real queue/consumer logic lives in ./worker.
 */
console.log('[media-worker] bootstrap');
process.on('SIGTERM', () => { console.log('[media-worker] SIGTERM'); process.exit(0); });

const port = Number(process.env.PORT || 0);
if (port) {
  const server = http.createServer((req, res) => {
    if (req.url === '/healthz') return res.writeHead(200).end(JSON.stringify({ ok: true }));
    if (req.url === '/readyz') return res.writeHead(200).end(JSON.stringify({ ready: true }));
    res.writeHead(404).end();
  });
  server.listen(port, () => console.log(`[media-worker] health server on :${port}`));
}
