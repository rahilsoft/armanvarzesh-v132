import helmet from "helmet";
/**
 * Minimal bootstrap for media-worker (placeholder).
 * TODO: integrate actual queue/consumer logic.
 */
console.log("[media-worker] starting...");
process.on('SIGTERM', () => { console.log('[media-worker] SIGTERM'); process.exit(0); });


// AUTO (Stage14): basic health/ready endpoints (no deps)
const http = app.getHttpAdapter().getInstance();
if (http && typeof http.get === 'function') {
  if (!http._auto_healthz) {
    http.get('/healthz', (req, res) => res.status(200).json({ ok: true }));
    http.get('/readyz', (req, res) => res.status(200).json({ ready: true }));
    http._auto_healthz = true;
  }
}
