import type { Registry } from 'prom-client';
import type { Express } from 'express';
import type pino from 'pino';

export type ServiceKitOptions = {
  serviceName: string;
  version?: string;
  enableCors?: boolean;
  corsOrigins?: string[];
  port?: number;
  logLevel?: string;
};

export type ServiceKit = {
  app: Express;
  registry: Registry;
  logger: pino.Logger;
  config: {
    SERVICE_NAME: string;
    PORT: number;
    LOG_LEVEL: string;
    CORS_ORIGINS: string[];
    NODE_ENV: string;
  };
  start: (port?: number) => Promise<import('http').Server>;
};
