"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueueContext = createQueueContext;
exports.addTestJob = addTestJob;
exports.attachWorkerMetrics = attachWorkerMetrics;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const zod_1 = require("zod");
const Env = zod_1.z.object({
    REDIS_URL: zod_1.z.string().url().optional(),
});
function createQueueContext(name, env = process.env) {
    const parsed = Env.safeParse(env);
    if (!parsed.success || !parsed.data.REDIS_URL) {
        return { queue: null, events: null, ready: false };
    }
    const conn = new ioredis_1.default(parsed.data.REDIS_URL);
    const queue = new bullmq_1.Queue(name, { connection: conn });
    const events = new bullmq_1.QueueEvents(name, { connection: conn });
    return { queue, events, ready: true };
}
async function addTestJob(ctx, payload) {
    if (!ctx.queue)
        throw new Error('Queue not ready');
    return ctx.queue.add('test', payload, { removeOnComplete: 100, attempts: 2 });
}
const prom_client_1 = __importDefault(require("prom-client"));
const jobCompleted = new prom_client_1.default.Counter({ name: 'queue_job_completed_total', help: 'Completed jobs', labelNames: ['queue'] });
const jobFailed = new prom_client_1.default.Counter({ name: 'queue_job_failed_total', help: 'Failed jobs', labelNames: ['queue'] });
function attachWorkerMetrics(ctx, handler) {
    if (!ctx.queue || ctx.worker)
        return;
    ctx.worker = new bullmq_1.Worker(ctx.queue.name, async (job) => {
        const start = Date.now();
        try {
            const res = handler ? await handler(job) : null;
            jobCompleted.labels(ctx.queue.name).inc();
            return res;
        }
        catch (e) {
            jobFailed.labels(ctx.queue.name).inc();
            throw e;
        }
        finally {
            // could add histogram for duration here
        }
    }, { connection: ctx.queue.opts.connection });
}
//# sourceMappingURL=queue.js.map