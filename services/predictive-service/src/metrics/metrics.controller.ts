import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { register, collectDefaultMetrics } from 'prom-client';
import type { Response } from 'express';
collectDefaultMetrics();
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller()
export class MetricsController { @Get('/metrics') async metrics(@Res() res:Response){ if(String(process.env.METRICS_ENABLED||'true')!=='true'){ return res.status(HttpStatus.NOT_FOUND).send('metrics disabled'); } res.setHeader('Content-Type', register.contentType); const metrics=await register.metrics(); return res.status(HttpStatus.OK).send(metrics); } }