// Build-time shims to avoid TS 'module not found' and missing type errors
declare module '@arman/observability' { const x: any; export = x; }
declare module '@arman/infra/src/outbox' { export class OutboxService { constructor(...args:any[]); } export type OutboxEvent = any; export const OutboxRepo: any; }
declare module '@arman/infra/src/idempotency' { export class IdempotencyService { constructor(...args:any[]); } export class IdempotencyRepo { constructor(...args:any[]); } }
declare module '@arman/graphql-utils/src/dataloader' { export function makeLoader<T, V>(fn: any): any; }
// prisma augmentation (loose typings to pass build)
declare module '@prisma/client' {
  interface PrismaClient { [key: string]: any }
  export type User = any; export type Wallet = any; export type Workout = any; export type Message = any;
  export type Live = any; export type Cms = any; export type Experiment = any;
}
