/* Stage 18 Metrics Middleware (example) */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Histogram, Registry } from 'prom-client';
@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private hist = new Histogram({ name:'http_request_duration_seconds', help:'req', labelNames:['route','method','status'] });
  use(req: any, res: any, next: Function) {
    const end = this.hist.startTimer({ route: req.path, method: req.method });
    res.on('finish', ()=>{ end({ status: String(res.statusCode) }); });
    next();
  }
}
