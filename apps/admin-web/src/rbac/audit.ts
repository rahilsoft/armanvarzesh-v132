export type AuditEvent={ who:string; what:string; when:number };
export function recordAudit(e: AuditEvent){
  // TODO: send to backend audit endpoint
  console.log('[audit]', e);
}
