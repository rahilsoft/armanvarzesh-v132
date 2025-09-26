import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req: any) => req.headers['x-request-id'] || randomUUID(),
        autoLogging: true,
        transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
      }
    })
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
