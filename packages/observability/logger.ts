export type LogLevel = 'debug'|'info'|'warn'|'error';
export type LogEvent = { level: LogLevel; message: string; ts: number; context?: Record<string, any> };
let buffer: LogEvent[] = [];
export function log(level: LogLevel, message: string, context?: Record<string, any>){
  const evt: LogEvent = { level, message, ts: Date.now(), context };
  buffer.push(evt);
  if(process.env.NODE_ENV!=='test') console[level === 'debug' ? 'log' : level](message, context||{});
  if(buffer.length>500) buffer.shift();
  return evt;
}
export const logDebug = (m:string,c?:any)=>log('debug',m,c);
export const logInfo = (m:string,c?:any)=>log('info',m,c);
export const logWarn = (m:string,c?:any)=>log('warn',m,c);
export const logError = (m:string,c?:any)=>log('error',m,c);
export function getBuffer(){ return buffer.slice(); }
