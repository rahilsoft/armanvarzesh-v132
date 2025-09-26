# Business Modules Census (Stages 33–35)

## payment

- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72` — hits: 38, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/parity_ops.d.ts:2`
    ```
// Generated for Stage 07 planning
export type MissingGqlOp = 'AddNote' | 'ArchiveClient' | 'AssignPlan' | 'BookReservation' | 'CancelReservation' | 'Client' | 'ClientNotes' | 'Clients' | 'CoachAvailability' | 'CoachReservations' | 'CreateAdmin' | 'CreateAvailability' | 'CreateChallenge' | 'CreateCoach' | 'CreateNotification' | 'CreateNutritionPlan' | 'CreatePayment' | 'CreateProduct' | 'CreateReward' | 'CreateSurvey';
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/e2e/flow.reservation-payment-notification.e2e.ts:8`
    ```
  const res = await fetch(BASE + path, init);
  return { status: res.status, json: await res.json().catch(()=>({})) };
}
describe('flow: reservation→payment→notification', ()=>{
  it('placeholder smoke', async ()=>{
    assert.equal(typeof BASE, 'string');
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/e2e/flow.reservation-payment-notification.e2e.ts:8`
    ```
  const res = await fetch(BASE + path, init);
  return { status: res.status, json: await res.json().catch(()=>({})) };
}
describe('flow: reservation→payment→notification', ()=>{
  it('placeholder smoke', async ()=>{
    assert.equal(typeof BASE, 'string');
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/infra` — hits: 2, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/infra/src/outbox.ts:5`
    ```
  aggregate: string;
  aggregateId: string;
  type: string;
  payload: any;
};

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/infra/src/index.ts:2`
    ```
export * from './outbox';
export * from './idempotency';
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/integration` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/integration/src/queue.ts:27`
    ```
  return { queue, events, ready: true };
}

export async function addTestJob(ctx: QueueContext, payload: any) {
  if (!ctx.queue) throw new Error('Queue not ready');
  return ctx.queue.add('test', payload, { removeOnComplete: 100, attempts: 2 });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/integration/src/queue.ts:29`
    ```

export async function addTestJob(ctx: QueueContext, payload: any) {
  if (!ctx.queue) throw new Error('Queue not ready');
  return ctx.queue.add('test', payload, { removeOnComplete: 100, attempts: 2 });
}

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/resilience` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/resilience/src/rmq.ts:3`
    ```
export type PublishOptions = { routingKey: string; headers?: Record<string,string>; };
export interface MessageBus {
  publish(exchange: string, payload: any, opts?: PublishOptions): Promise<void>;
  subscribe(queue: string, handler: (msg: any, headers: Record<string,string>)=>Promise<void>): Promise<void>;
}
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/http-client` — hits: 3, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/http-client/src/client.ts:43`
    ```
        }
      } catch {}
    }
    // idempotency for mutating methods
    const method = (config.method || 'get').toLowerCase();
    if (['post','put','patch','delete'].includes(method)) {
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/http-client/src/client.ts:47`
    ```
    const method = (config.method || 'get').toLowerCase();
    if (['post','put','patch','delete'].includes(method)) {
      config.headers = config.headers || {};
      if (!(config.headers as any)['Idempotency-Key']) {
        (config.headers as any)['Idempotency-Key'] = cryptoRandomId();
      }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/http-client/src/client.ts:48`
    ```
    if (['post','put','patch','delete'].includes(method)) {
      config.headers = config.headers || {};
      if (!(config.headers as any)['Idempotency-Key']) {
        (config.headers as any)['Idempotency-Key'] = cryptoRandomId();
      }
    }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/auth-kit` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/auth-kit/src/jwks.ts:16`
    ```

  return {
    jwk,
    async sign(payload: Record<string, any>, opts: { iss?: string; aud?: string; expSec?: number } = {}) {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + (opts.expSec ?? 3600);
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/auth-kit/src/jwks.ts:19`
    ```
    async sign(payload: Record<string, any>, opts: { iss?: string; aud?: string; expSec?: number } = {}) {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + (opts.expSec ?? 3600);
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: spec.alg, kid: spec.kid })
        .setIssuedAt(now)
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/vitrin-site` — hits: 30, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/vitrin-site/app/api/metrics/route.ts:11`
    ```

const ALLOWED = new Map<string,string>([
  ['ctr_per_tile', `WITH impressions AS (
    SELECT JSON_VALUE(payload, '$.id') AS id,
           JSON_VALUE(payload, '$.variant') AS variant,
           count() AS imp
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/vitrin-site/app/api/metrics/route.ts:12`
    ```
const ALLOWED = new Map<string,string>([
  ['ctr_per_tile', `WITH impressions AS (
    SELECT JSON_VALUE(payload, '$.id') AS id,
           JSON_VALUE(payload, '$.variant') AS variant,
           count() AS imp
    FROM ${CH_DB}.events
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/vitrin-site/app/api/metrics/route.ts:19`
    ```
    GROUP BY id, variant
  ),
  clicks AS (
    SELECT JSON_VALUE(payload, '$.id') AS id,
           JSON_VALUE(payload, '$.variant') AS variant,
           count() AS clk
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin` — hits: 30, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/utils/permissions.ts:6`
    ```
  VIEW_USERS = "view_users",
  EDIT_USERS = "edit_users",
  VIEW_COACHES = "view_coaches",
  MANAGE_PAYMENTS = "manage_payments",
  VIEW_ANALYTICS = "view_analytics"
}
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/utils/permissions.ts:6`
    ```
  VIEW_USERS = "view_users",
  EDIT_USERS = "edit_users",
  VIEW_COACHES = "view_coaches",
  MANAGE_PAYMENTS = "manage_payments",
  VIEW_ANALYTICS = "view_analytics"
}
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/graphql/mutations/payment.mutations.ts:4`
    ```

import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) { id }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app` — hits: 18, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/payment.queries.ts:4`
    ```

import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql\`
  query CoachPayments {
    payments {
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/payment.queries.ts:5`
    ```
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql\`
  query CoachPayments {
    payments {
      id
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/payment.queries.ts:6`
    ```

export const GET_PAYMENTS = gql\`
  query CoachPayments {
    payments {
      id
      amount
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend` — hits: 737, controller:1, resolver:1, service:1, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/app.module.ts:17`
    ```
import { CoachesModule } from './src/coaches/coaches.module';
import { WorkoutsModule } from './src/workouts/workouts.module';
import { NutritionModule } from './src/nutrition/nutrition.module';
import { PaymentsModule } from './src/payments/payments.module';
import { WalletModule } from './src/wallet/wallet.module';
import { MarketplaceModule } from './src/marketplace/marketplace.module';
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/app.module.ts:17`
    ```
import { CoachesModule } from './src/coaches/coaches.module';
import { WorkoutsModule } from './src/workouts/workouts.module';
import { NutritionModule } from './src/nutrition/nutrition.module';
import { PaymentsModule } from './src/payments/payments.module';
import { WalletModule } from './src/wallet/wallet.module';
import { MarketplaceModule } from './src/marketplace/marketplace.module';
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/app.module.ts:17`
    ```
import { CoachesModule } from './src/coaches/coaches.module';
import { WorkoutsModule } from './src/workouts/workouts.module';
import { NutritionModule } from './src/nutrition/nutrition.module';
import { PaymentsModule } from './src/payments/payments.module';
import { WalletModule } from './src/wallet/wallet.module';
import { MarketplaceModule } from './src/marketplace/marketplace.module';
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app` — hits: 33, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/payment.mutations.ts:4`
    ```

import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql\`
  mutation CreatePayment($userId: Int!, $input: PaymentInput!) {
    createPayment(userId: $userId, input: $input)
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/payment.mutations.ts:5`
    ```
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql\`
  mutation CreatePayment($userId: Int!, $input: PaymentInput!) {
    createPayment(userId: $userId, input: $input)
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/graphql/mutations/payment.mutations.ts:5`
    ```
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql\`
  mutation CreatePayment($userId: Int!, $input: PaymentInput!) {
    createPayment(userId: $userId, input: $input)
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/rewards-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/rewards-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service` — hits: 229, controller:1, resolver:1, service:1, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/test/basic.spec.ts:1`
    ```
import { PaymentsServiceService } from '../src/payments-service.service';

describe('payments-service service', () => {
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/test/basic.spec.ts:1`
    ```
import { PaymentsServiceService } from '../src/payments-service.service';

describe('payments-service service', () => {
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/test/basic.spec.ts:3`
    ```
import { PaymentsServiceService } from '../src/payments-service.service';

describe('payments-service service', () => {
  it('alive', () => {
    const s = new PaymentsServiceService();
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — predictive-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — predictive-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service` — hits: 8, controller:0, resolver:0, service:1, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/prisma/schema.prisma:9`
    ```
  id        String   @id @default(cuid())
  userId    String
  kind      String
  payload   Json
  issuedAt  DateTime @default(now())
  revoked   Boolean  @default(false)
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.service.ts:5`
    ```
import QRCode from 'qrcode';

export class CertificateService {
  async issueCertificate(payload: Record<string, any>) {
    const token = jwt.sign(payload, process.env.CERT_SECRET || 'change_me', { expiresIn: '365d' });
    const url = `${process.env.CERT_VERIFY_URL || 'https://example.com/verify'}?t=${token}`;
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/src/certificate/certificate.service.ts:6`
    ```

export class CertificateService {
  async issueCertificate(payload: Record<string, any>) {
    const token = jwt.sign(payload, process.env.CERT_SECRET || 'change_me', { expiresIn: '365d' });
    const url = `${process.env.CERT_VERIFY_URL || 'https://example.com/verify'}?t=${token}`;
    const qrDataUrl = await QRCode.toDataURL(url);
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — ai-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — ai-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-collector` — hits: 3, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-collector/src/index.ts:31`
    ```
  ts: z.number().or(z.string()).transform(v=> Number(v)),
  uid: z.string().optional(),
  session: z.string().optional(),
  payload: z.record(z.any()).optional(),
  ua: z.string().optional(),
  ip: z.string().optional()
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-collector/src/index.ts:52`
    ```
      session: e.session || null,
      ua: e.ua || req.headers['user-agent'] || null,
      ip: e.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
      payload: JSON.stringify(e.payload || {})
    }));

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-collector/src/index.ts:52`
    ```
      session: e.session || null,
      ua: e.ua || req.headers['user-agent'] || null,
      ip: e.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
      payload: JSON.stringify(e.payload || {})
    }));

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — vip-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — vip-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/physio-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/physio-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service` — hits: 3, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — nutrition-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — nutrition-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/nutrition/nutrition.service.ts:30`
    ```
   * Update an existing food item. Only provided fields will be updated.
   */
  async updateFoodItem(id: number, input: Partial<UpdateFoodItemInput>) {
    // Remove the id property from the update payload to avoid errors
    const { id: _, ...data } = input;
    return this.prisma.foodItem.update({
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/assessments-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/assessments-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — reward-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — reward-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service` — hits: 4, controller:0, resolver:1, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — chat-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — chat-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/chat/chat.resolver.ts:41`
    ```
  }

  @Subscription(() => ChatMessageType, {
    filter: (payload, variables) => {
      // If receiverId is provided as a variable, only send messages to that receiver
      if (variables.receiverId) {
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service` — hits: 4, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — marketplace-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — marketplace-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/marketplace/marketplace.service.ts:24`
    ```
/**
 * MarketplaceService manages an in-memory list of items and purchases. It allows
 * creating, updating, deleting and listing items as well as purchasing items
 * by users. In production, persistent storage and integration with a payment
 * gateway would be required.
 */
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — assessment-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — assessment-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — monitoring-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — monitoring-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/analytics-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/analytics-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — coaches-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — coaches-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service` — hits: 4, controller:0, resolver:1, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — notifications-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — notifications-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/notifications/notifications.resolver.ts:36`
    ```
  }

  @Subscription(() => NotificationType, {
    filter: (payload, variables) => {
      return payload.notificationSent.userId === variables.userId;
    },
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — workouts-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — workouts-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service` — hits: 6, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — auth-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — auth-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/main.js:10`
    ```
await app.register(cors, { origin: true, credentials: true });

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const sign = (payload)=> jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

app.post('/auth/login', async (req, reply)=>{
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service` — hits: 18, controller:0, resolver:0, service:0, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — content-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — content-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/prisma/schema.prisma:112`
    ```
  planId    String?
  type      String   // MEAL_REMINDER|WATER_REMINDER
  dueAt     DateTime
  payload   Json?
  status    String   @default("PENDING") // PENDING|SENT|CANCELLED
  createdAt DateTime @default(now())
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/booking-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — @arman/booking-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — challenges-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — challenges-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — courses-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — courses-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — users-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — users-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — affiliate-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/test/e2e/core.e2e.spec.ts:8`
    ```
describe.skip('E2E core flows — affiliate-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
});
    ```

## reservation_booking

- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72` — hits: 20, controller:1, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_booking.controller.ready.ts:1`
    ```
// Stage 14 Ready Controller for REST call: GET /api/booking
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/api-map/server-stubs/ready/rest_GET__api_booking.controller.ready.ts:4`
    ```
// Stage 14 Ready Controller for REST call: GET /api/booking
/*
import { Controller, Get, Post, Patch, Put, Delete } from '@nestjs/common';
@Controller('api/booking')
export class GET__api_bookingController {
  @Get()
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/lighthouse/collect.js:4`
    ```
#!/usr/bin/env node
const fs = require('fs'), path=require('path'), https=require('https'), http=require('http');
const BASE = process.env.STAGING_BASE_URL || '';
const routes = ['/', '/workouts', '/nutrition', '/booking', '/vip'];
if (!BASE) { console.error('STAGING_BASE_URL is required'); process.exit(1); }
const out = path.join(process.cwd(), '.lighthouse-static');
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/libs` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/libs/index.ts:1`
    ```
export const version='0.1.0';
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/service-kit` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/service-kit/src/types.ts:7`
    ```

export type ServiceKitOptions = {
  serviceName: string;
  version?: string;
  enableCors?: boolean;
  corsOrigins?: string[];
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:7`
    ```
export const PLANS_LIST = gql`
  query Plans($cursor:String, $limit:Int, $search:String){
    plans(cursor:$cursor, limit:$limit, search:$search){
      edges{ id title description status version updatedAt assignedCount }
      pageInfo{ endCursor hasNextPage }
      total
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:17`
    ```
export const PLAN_BY_ID = gql`
  query Plan($id:ID!){
    plan(id:$id){
      id title description status version updatedAt
      days{
        id order title
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/graphql/queries/plans.queries.ts:33`
    ```
export const UPSERT_PLAN = gql`
  mutation UpsertPlan($input:UpsertPlanInput!){
    upsertPlan(input:$input){
      id title description status version updatedAt
    }
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend` — hits: 59, controller:1, resolver:1, service:1, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/test/e2e/reservations.e2e-spec.ts:2`
    ```
describe('Reservations E2E (placeholder)', () => {
  it('should reserve and prevent double-booking (placeholder)', () => {
    expect(true).toBe(true);
  });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — @arman/backend', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/e2e/reservations.e2e.spec.ts:5`
    ```
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReservationsController } from '../src/reservations/reservations.controller';
import { ReservationService } from '../src/reservations/reservation.service';

describe('Reservations E2E (memory optimistic)', () => {
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/rewards-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — @arman/rewards-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — payments-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/payments-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — predictive-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/predictive-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/certificate-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — @arman/certificate-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — ai-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — vip-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/physio-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — @arman/physio-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — nutrition-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/nutrition-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessments-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — @arman/assessments-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — reward-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — chat-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — marketplace-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/media-worker` — hits: 4, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/media-worker/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/media-worker/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/media-worker/src/index.ts:15`
    ```
  // example endpoint
  ctx.app.get('/info', (_req, res) => res.json({
    service: serviceName,
    version: pkg.version,
    time: new Date().toISOString()
  }));
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — assessment-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — monitoring-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/monitoring-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/analytics-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — @arman/analytics-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — coaches-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/coaches-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — notifications-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — workouts-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — auth-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/auth-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service` — hits: 21, controller:0, resolver:1, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — content-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service` — hits: 8, controller:1, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/main.ts:8`
    ```
app.module'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('booking')
  

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/app.module.ts:2`
    ```
import { Module } from '@nestjs/common'
import { BookingController } from './booking.controller'
import { HealthController } from './health.controller'
import { BookingService } from './booking.service'
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/booking-service/src/app.module.ts:4`
    ```
import { Module } from '@nestjs/common'
import { BookingController } from './booking.controller'
import { HealthController } from './health.controller'
import { BookingService } from './booking.service'
@Module({ controllers: [BookingController, HealthController], providers: [BookingService] })
export class AppModule{}
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — challenges-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — courses-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — users-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/users-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/test/e2e/core.e2e.spec.ts:7`
    ```
   This file is safe and non-executable without a runner. */
describe.skip('E2E core flows — affiliate-service', () => {
  it('bootstrap', () => { /* TODO: bring up app (supertest/app.init) */ });
  it('happy path — reservation', () => { /* TODO */ });
  it('happy path — payment', () => { /* TODO */ });
  it('edge cases', () => { /* TODO */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/src/index.ts:9`
    ```
async function main() {
  const ctx = await createApp({
    serviceName,
    version: pkg.version,
  });

    ```

## notifications

- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72` — hits: 16, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/scan-injection.js:5`
    ```
const fs = require('fs'); const path = require('path');
const ROOT = process.argv[2] || process.cwd();
const SQL_WORDS = ['select','insert','update','delete','into','from','where','join'];
function walk(dir, exts = ['.ts','.js']) { const out = []; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...walk(p, exts)); else if (exts.includes(path.extname(p))) out.push(p); } return out; }
function scanFile(p) { const text = fs.readFileSync(p, 'utf8'); const lines = text.split(/\r?\n/); const findings = []; lines.forEach((ln, i) => {
  if (ln.includes('$executeRawUnsafe') || ln.includes('$queryRawUnsafe')) findings.push({ line: i+1, kind: 'unsafe-raw', snippet: ln.trim() });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/scan-injection.js:5`
    ```
const fs = require('fs'); const path = require('path');
const ROOT = process.argv[2] || process.cwd();
const SQL_WORDS = ['select','insert','update','delete','into','from','where','join'];
function walk(dir, exts = ['.ts','.js']) { const out = []; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...walk(p, exts)); else if (exts.includes(path.extname(p))) out.push(p); } return out; }
function scanFile(p) { const text = fs.readFileSync(p, 'utf8'); const lines = text.split(/\r?\n/); const findings = []; lines.forEach((ln, i) => {
  if (ln.includes('$executeRawUnsafe') || ln.includes('$queryRawUnsafe')) findings.push({ line: i+1, kind: 'unsafe-raw', snippet: ln.trim() });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/tools/scan-injection.js:7`
    ```
const SQL_WORDS = ['select','insert','update','delete','into','from','where','join'];
function walk(dir, exts = ['.ts','.js']) { const out = []; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) out.push(...walk(p, exts)); else if (exts.includes(path.extname(p))) out.push(p); } return out; }
function scanFile(p) { const text = fs.readFileSync(p, 'utf8'); const lines = text.split(/\r?\n/); const findings = []; lines.forEach((ln, i) => {
  if (ln.includes('$executeRawUnsafe') || ln.includes('$queryRawUnsafe')) findings.push({ line: i+1, kind: 'unsafe-raw', snippet: ln.trim() });
  if (ln.includes('`') && SQL_WORDS.some(w => ln.toLowerCase().includes(w))) { if (ln.includes('+') || ln.includes('${')) findings.push({ line: i+1, kind: 'template-sql', snippet: ln.trim() }); }
}); return findings; }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/awards-engine` — hits: 5, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/awards-engine/src/index.ts:8`
    ```
export function evaluateAwards(history: DailyMetrics[], existing: Set<AwardCode>): Award[] {
  const out: Award[] = []; const today = history.at(-1); if (!today) return out;
  if (today.moveKcal >= today.goals.moveKcal && !existing.has('DAILY_MOVE_GOAL'))
    out.push({ code: 'DAILY_MOVE_GOAL', achievedAt: new Date().toISOString(), meta: { kcal: today.moveKcal } });
  const anyEx = history.some(d => d.exerciseMin>0); const prevEx = history.slice(0,-1).some(d => d.exerciseMin>0);
  if (anyEx && !prevEx && !existing.has('FIRST_WORKOUT')) out.push({ code: 'FIRST_WORKOUT', achievedAt: new Date().toISOString() });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/awards-engine/src/index.ts:10`
    ```
  if (today.moveKcal >= today.goals.moveKcal && !existing.has('DAILY_MOVE_GOAL'))
    out.push({ code: 'DAILY_MOVE_GOAL', achievedAt: new Date().toISOString(), meta: { kcal: today.moveKcal } });
  const anyEx = history.some(d => d.exerciseMin>0); const prevEx = history.slice(0,-1).some(d => d.exerciseMin>0);
  if (anyEx && !prevEx && !existing.has('FIRST_WORKOUT')) out.push({ code: 'FIRST_WORKOUT', achievedAt: new Date().toISOString() });
  const last7 = history.slice(-7); const cnt = last7.filter(d => d.exerciseMin >= 10).length;
  if (cnt >= 5 && !existing.has('FIVE_WORKOUTS_WEEK')) out.push({ code: 'FIVE_WORKOUTS_WEEK', achievedAt: new Date().toISOString(), meta: { days: cnt } });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/awards-engine/src/index.ts:12`
    ```
  const anyEx = history.some(d => d.exerciseMin>0); const prevEx = history.slice(0,-1).some(d => d.exerciseMin>0);
  if (anyEx && !prevEx && !existing.has('FIRST_WORKOUT')) out.push({ code: 'FIRST_WORKOUT', achievedAt: new Date().toISOString() });
  const last7 = history.slice(-7); const cnt = last7.filter(d => d.exerciseMin >= 10).length;
  if (cnt >= 5 && !existing.has('FIVE_WORKOUTS_WEEK')) out.push({ code: 'FIVE_WORKOUTS_WEEK', achievedAt: new Date().toISOString(), meta: { days: cnt } });
  const achieved = (d: DailyMetrics)=> d.moveKcal>=d.goals.moveKcal && d.exerciseMin>=d.goals.exerciseMin && d.standHr>=d.goals.standHr;
  let streak = 0; for (let i=history.length-1;i>=0;i--){ if (achieved(history[i])) streak++; else break; }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/utils` — hits: 1, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/utils/src/dispose.ts:19`
    ```

export class Scope {
  private disposers: Disposer[] = [];
  add(d: Disposer | void | null) { if (typeof d === 'function') this.disposers.push(d); return d; }
  disposeAll() { for (const d of this.disposers.splice(0)) try { d(); } catch {} }
}
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/contracts-tests` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/contracts-tests/tests/contracts-compat.spec.js:20`
    ```
          const p = path.join(d, e);
          const stat = fs.statSync(p);
          if (stat.isDirectory()) walk(p);
          else if (e.endsWith('.ts')) files.push(p);
        }
      })(dir);
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/packages/contracts-tests/scripts/make-snapshot.js:11`
    ```
      const p = path.join(d, e);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (e.endsWith('.ts')) files.push(p);
    }
  })(dir);
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/hooks/useNotification.ts:3`
    ```

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { CREATE_NOTIFICATION } from "@graphql/mutations/notification.mutations";

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/armanfit-admin/src/hooks/useNotification.ts:4`
    ```

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { CREATE_NOTIFICATION } from "@graphql/mutations/notification.mutations";

export function useNotification() {
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/hooks/useNotification.ts:3`
    ```

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { SEND_NOTIFICATION } from "@graphql/mutations/notification.mutations";

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/coach-app/hooks/useNotification.ts:4`
    ```

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { SEND_NOTIFICATION } from "@graphql/mutations/notification.mutations";

export function useNotification() {
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend` — hits: 42, controller:1, resolver:1, service:1, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/payments.service.spec.ts:7`
    ```
  public queries: any[] = [];
  public execs: any[] = [];
  async query<T>(_sql: any): Promise<T[]> {
    this.queries.push(_sql);
    // emulate "no duplicate" by default
    return [] as any;
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/payments.service.spec.ts:12`
    ```
    return [] as any;
  }
  async exec(_sql: any): Promise<void> {
    this.execs.push(_sql);
    return;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/backend/e2e.integration.spec.ts:33`
    ```
    const s = String(_sql);
    if (s.startsWith('INSERT INTO payments')) {
      // naive parse just for test
      this.payments.push({ id: String(this.payments.length + 1), user_id: 'demo-user', amount_cents: 10000, currency: 'IRR', status: 'CREATED', created_at: new Date() });
    }
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app` — hits: 2, controller:0, resolver:0, service:0, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/hooks/useNotification.ts:3`
    ```

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { CREATE_NOTIFICATION } from "@graphql/mutations/notification.mutations";

    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/apps/user-app/hooks/useNotification.ts:4`
    ```

import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS } from "@graphql/queries/notification.queries";
import { CREATE_NOTIFICATION } from "@graphql/mutations/notification.mutations";

export function useNotification(userId: number) {
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service` — hits: 1, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/ai-service/src/ai/ai.service.ts:27`
    ```
    const level = userId % 3;
    if (level === 0) {
      return [
        { exerciseName: 'Push-up', sets: 3, reps: 12, weight: 0 },
        { exerciseName: 'Bodyweight Squat', sets: 3, reps: 15, weight: 0 },
        { exerciseName: 'Plank', sets: 3, reps: 60, weight: 0 },
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service` — hits: 1, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/vip-service/src/vip/vip.service.ts:30`
    ```
      level,
      joinedAt: new Date(),
    };
    this.vipUsers.push(vip);
    return vip;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service` — hits: 2, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/reward/reward.service.ts:34`
    ```
      xp,
      createdAt: new Date(),
    };
    this.rewards.push(reward);
    return reward;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/reward-service/src/reward/reward.service.ts:51`
    ```
      rewardId,
      grantedAt: new Date(),
    };
    this.userRewards.push(userReward);
    return userReward;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service` — hits: 1, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/chat-service/src/chat/chat.service.ts:86`
    ```
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.push(message);
    return message;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service` — hits: 2, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/marketplace/marketplace.service.ts:44`
    ```
      createdBy,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/marketplace-service/src/marketplace/marketplace.service.ts:83`
    ```
      price: item.price,
      purchasedAt: new Date(),
    };
    this.purchases.push(purchase);
    return purchase;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service` — hits: 2, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/assessment/assessment.service.ts:41`
    ```
      createdBy,
      createdAt: new Date(),
    };
    this.tests.push(test);
    return test;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/assessment-service/src/assessment/assessment.service.ts:75`
    ```
      score,
      recordedAt: new Date(),
    };
    this.results.push(result);
    return result;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service` — hits: 35, controller:1, resolver:1, service:1, prisma:1
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/test/contract.rest.spec.ts:10`
    ```
  it('GET /notifications/:id defined @ notifications.controller.ts:23', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/email defined @ notifications-service.controller.ts:11', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/email defined @ notifications.controller.ts:8', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/push defined @ notifications-service.controller.ts:21', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/push defined @ notifications.controller.ts:18', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/sms defined @ notifications-service.controller.ts:16', () => { /* TODO: supertest/contract */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/test/contract.rest.spec.ts:11`
    ```
  it('POST /notifications/email defined @ notifications-service.controller.ts:11', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/email defined @ notifications.controller.ts:8', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/push defined @ notifications-service.controller.ts:21', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/push defined @ notifications.controller.ts:18', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/sms defined @ notifications-service.controller.ts:16', () => { /* TODO: supertest/contract */ });
  it('POST /notifications/sms defined @ notifications.controller.ts:13', () => { /* TODO: supertest/contract */ });
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/notifications-service/prisma/schema.prisma:21`
    ```
  FAILED
}

model Notification {

  id        String             @id @default(uuid())
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service` — hits: 4, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/prisma/seed.ts:4`
    ```
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const data = [
  { name: 'Push Up', level: 'beginner', muscle: 'chest', equipment: 'bodyweight' },
  { name: 'Pull Up', level: 'intermediate', muscle: 'back', equipment: 'bodyweight' },
  { name: 'Squat', level: 'beginner', muscle: 'legs', equipment: 'bodyweight' },
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.service.ts:44`
    ```
    for (const ex of pool) {
      const m = ex.muscle.toLowerCase();
      if (!byMuscle.has(m)) byMuscle.set(m, []);
      byMuscle.get(m)!.push(ex);
    }
    // Build items
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/workouts-service/src/workouts-service.service.ts:57`
    ```
      const list = byMuscle.get(m) || [];
      if (list.length === 0) continue;
      const ex = list[Math.floor(Math.random() * list.length)];
      items.push({
        exerciseId: ex.id,
        sets: setsByGoal[dto.goal],
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service` — hits: 34, controller:0, resolver:1, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/plan/plan.resolver.ts:462`
    ```
          sec += ((b.items?.length||1)-1) * (b.restBetweenItemsSec||30) * (b.rounds||1);
        }
      }
      blocks.push({ blockId: b.id, seconds: sec, rounds: b.rounds||null });
      total += sec;
    }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/plan/plan.resolver.ts:913`
    ```
  async validatePlan(@Args('planId') planId:string): Promise<ValidationIssueDTO[]> {
    const issues:ValidationIssueDTO[] = [];
    const plan:any = await prisma.plan.findUnique({ where:{ id: planId }, include:{ days:{ include:{ blocks:{ include:{ items:true } } } } } });
    if (!plan){ issues.push({ level:'error', message:'Plan not found' } as any); return issues; }
    for (const d of plan.days){
      for (const b of d.blocks){
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/content-service/src/plan/plan.resolver.ts:917`
    ```
    for (const d of plan.days){
      for (const b of d.blocks){
        const t = (b.type||'SINGLE').toUpperCase();
        if (t==='SUPERSET' && (b.items||[]).length<2) issues.push({ level:'warn', message:'Superset needs ≥2 items', blockId:b.id } as any);
        if (t==='TRISET' && (b.items||[]).length<3) issues.push({ level:'warn', message:'Triset needs ≥3 items', blockId:b.id } as any);
        if (t==='CIRCUIT'){
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service` — hits: 2, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/challenges/challenges.service.ts:41`
    ```
      endDate,
      createdBy,
    };
    this.challenges.push(challenge);
    return challenge;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/challenges-service/src/challenges/challenges.service.ts:67`
    ```
      points: 0,
      joinedAt: new Date(),
    };
    this.entries.push(entry);
    return entry;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service` — hits: 3, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/courses/courses.service.ts:53`
    ```
      endDate,
      createdAt: new Date(),
    };
    this.courses.push(course);
    return course;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/courses/courses.service.ts:93`
    ```
      userId,
      enrolledAt: new Date(),
    };
    this.enrollments.push(enrollment);
    return enrollment;
  }
    ```
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/courses-service/src/courses/courses.service.ts:107`
    ```
      date,
      durationMinutes,
    };
    this.sessions.push(session);
    return session;
  }
    ```
- **Package**: `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service` — hits: 1, controller:0, resolver:0, service:1, prisma:0
  - `/mnt/data/armanvarzesh_v72/armanvarzesh v72/services/affiliate-service/src/affiliate/affiliate.service.ts:28`
    ```
      refCount: 0,
      createdAt: new Date(),
    };
    this.affiliates.push(affiliate);
    return affiliate;
  }
    ```

