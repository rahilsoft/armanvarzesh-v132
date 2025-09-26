import { PrismaReadiness } from './prisma.readiness';
import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
@Module({ providers:[PrismaReadiness, ChatGateway, ChatService], controllers:[HealthController, ChatController] })
export class AppModule {}
