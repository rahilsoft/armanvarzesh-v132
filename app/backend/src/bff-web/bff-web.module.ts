import { Module } from '@nestjs/common';
import { BffWebController } from './bff-web.controller';
import { PrismaService } from '../database/prisma.service';
@Module({ controllers: [BffWebController], providers: [PrismaService] })
export class BffWebModule {}
