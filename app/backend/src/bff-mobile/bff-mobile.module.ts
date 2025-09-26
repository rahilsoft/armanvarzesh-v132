import { Module } from '@nestjs/common';
import { BffMobileController } from './bff-mobile.controller';
import { PrismaService } from '../database/prisma.service';
@Module({ controllers: [BffMobileController], providers: [PrismaService] })
export class BffMobileModule {}
