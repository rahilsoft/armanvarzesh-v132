import { Injectable, Inject, Logger } from '@nestjs/common';
import { Queue, Worker, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaService } from '../database/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../notifications/notifications.module';

@Injectable()
export class RemindersService {
  private conn = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379/1');
  private q = new Queue('reservations:reminder', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: this.conn });
  private logger = new Logger(RemindersService.name);

  constructor(private readonly prisma: PrismaService, @Inject(PUB_SUB) private pubSub: PubSub) {
    new Worker('reservations:reminder', async job => { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, concurrency: parseInt(process.env.WORKER_CONCURRENCY||'4'), 
      const { userId, text } = job.data;
      // Persist notification
      const n = await this.prisma.notification.create({ data: { userId, text } });
      // Publish realtime
      try { await this.pubSub.publish('notificationReceived', { notificationReceived: n }); } catch {}
      this.logger.log(`Reminder sent to user ${userId}: ${text}`);
    }, { connection: this.conn });
  }

  async schedule(userId: number, text: string, runAt: Date) {
    const delay = Math.max(0, runAt.getTime() - Date.now());
    const opts: JobsOptions = { delay, removeOnComplete: 50, removeOnFail: 10 };
    await this.q.add('reminder', { userId, text }, opts);
  }
}
