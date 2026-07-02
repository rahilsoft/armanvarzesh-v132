import { LoaderFactory } from '@arman/graphql-dataloader';

import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsResolver } from './workouts.resolver';
import { WorkoutPlansService } from './workout-plans.service';
import { WorkoutPlansResolver } from './workout-plans.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [
    LoaderFactory, PrismaService,
    WorkoutsService, WorkoutsResolver,
    WorkoutPlansService, WorkoutPlansResolver,
  ],
  exports: [WorkoutsService, WorkoutPlansService]
})
export class WorkoutsModule {}
