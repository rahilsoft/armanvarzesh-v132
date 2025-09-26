import { SetMetadata } from '@nestjs/common';
export const AUDIT_ACTION = 'audit_action';
export const AuditAction = (name: string) => SetMetadata(AUDIT_ACTION, name);
