import { Request, Response } from 'express';
let prom: any;
try { prom = require('prom-client'); } catch { prom = null; }

export function initMetrics() {
  if (!prom) return;
  prom.collectDefaultMetrics();
}

let httpCounter: any, httpHist: any;
if (prom) {
  httpCounter = new prom.Counter({ name: 'http_requests_total', help: 'HTTP requests', labelNames: ['method','route','status'] });
  httpHist = new prom.Histogram({ name: 'http_request_duration_seconds', help: 'Duration seconds', labelNames: ['method','route','status'], buckets: [0.05,0.1,0.2,0.3,0.5,0.8,1,2,3,5] });
}

export function metricsMiddleware(req: Request, res: Response, next: any) {
  if (!prom) return next();
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const route = (req.route?.path) || req.path || 'unknown';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    try {
      httpCounter.labels(labels.method, labels.route, labels.status).inc();
      const end = process.hrtime.bigint();
      const secs = Number(end - start) / 1e9;
      httpHist.labels(labels.method, labels.route, labels.status).observe(secs);
    } catch {}
  });
  next();
}

export function metricsHandler(_req: Request, res: Response) {
  if (!prom) return res.status(501).send('# prom-client not installed');
  res.setHeader('Content-Type', prom.register.contentType);
  return res.send(prom.register.metrics());
}
