
export class AuditLog {
  id: number;
  userId: number;
  action: string;
  meta?: string;
  timestamp: Date;
}
