import { Module } from '@nestjs/common';
import { BffController } from './bff.controller';
import { PrismaService } from '../database/prisma.service';
@Module({ controllers: [BffController], providers: [PrismaService] })
export class BffModule {}
