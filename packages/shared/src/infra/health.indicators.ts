import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Client as PgClient } from 'pg';
import Redis from 'ioredis';
import amqplib from 'amqplib';
import { Client as MinioClient } from 'minio';

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, url: string): Promise<HealthIndicatorResult> {
    const client = new PgClient({ connectionString: url });
    try {
      await client.connect();
      await client.query('SELECT 1');
      return this.getStatus(key, true);
    } catch (e) {
      return this.getStatus(key, false, { message: e.message });
    } finally {
      try { await client.end(); } catch {}
    }
  }
}

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, url: string): Promise<HealthIndicatorResult> {
    const client = new Redis(url);
    try {
      await client.ping();
      return this.getStatus(key, true);
    } catch (e) {
      return this.getStatus(key, false, { message: e.message });
    } finally {
      try { client.disconnect(); } catch {}
    }
  }
}

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, url: string): Promise<HealthIndicatorResult> {
    let conn: any;
    try {
      conn = await amqplib.connect(url);
      await conn.close();
      return this.getStatus(key, true);
    } catch (e) {
      return this.getStatus(key, false, { message: e.message });
    } finally {
      try { if (conn) await conn.close(); } catch {}
    }
  }
}

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, endpoint: string, accessKey: string, secretKey: string, port: number): Promise<HealthIndicatorResult> {
    const client = new MinioClient({ endPoint: endpoint, port, useSSL: false, accessKey, secretKey });
    try {
      await client.listBuckets();
      return this.getStatus(key, true);
    } catch (e) {
      return this.getStatus(key, false, { message: e.message });
    }
  }
}