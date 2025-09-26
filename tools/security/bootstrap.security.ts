/* Stage 22 security bootstrap (conditional) */
import type { INestApplication } from '@nestjs/common';
export async function applySecurity(app: INestApplication){
  try {
    const anyApp:any = app as any;
    const helmet = (await import('helmet')).default || (await import('helmet'));
    const rateLimit = (await import('express-rate-limit')).default || (await import('express-rate-limit'));
    anyApp.use(helmet());
    anyApp.enableCors({ origin:true, credentials:true });
    anyApp.use(rateLimit({ windowMs: 60*1000, max: 120 }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[AV][Stage22] security modules not installed, skipping');
  }
}
