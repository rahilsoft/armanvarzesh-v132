import { LoaderFactory } from '@arman/graphql-dataloader';

import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsResolver } from './workouts.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [ LoaderFactory, PrismaService, WorkoutsService, WorkoutsResolver],
  exports: [WorkoutsService]
})
export class WorkoutsModule {}
