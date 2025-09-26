import { Injectable, LoggerService } from '@nestjs/common';

type Level = 'debug' | 'info' | 'warn' | 'error';
const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function ts() { return new Date().toISOString(); }
function fmt(level: Level, msg: any, ctx?: string, meta?: Record<string, any>) {
  const base: any = { ts: ts(), level, msg: typeof msg === 'string' ? msg : JSON.stringify(msg) };
  if (ctx) base.ctx = ctx;
  if (meta) Object.assign(base, meta);
  return JSON.stringify(base);
}

@Injectable()
export class JsonLogger implements LoggerService {
  private threshold: number;
  constructor(level: Level = (process.env.LOG_LEVEL as Level) || 'info') {
    this.threshold = LEVELS[level] ?? 20;
  }
  private should(l: Level) { return (LEVELS[l] ?? 99) >= this.threshold; }
  log(message: any, context?: string)    { if (this.should('info'))  console.log(fmt('info',  message, context)); }
  error(message: any, trace?: string, context?: string) { if (this.should('error')) console.error(fmt('error', message, context, trace?{trace}:undefined)); }
  warn(message: any, context?: string)   { if (this.should('warn'))  console.warn(fmt('warn',  message, context)); }
  debug?(message: any, context?: string) { if (this.should('debug')) console.debug(fmt('debug', message, context)); }
  verbose?(message: any, context?: string) { if (this.should('debug')) console.debug(fmt('debug', message, context)); }
}
