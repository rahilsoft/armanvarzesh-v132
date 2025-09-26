
import { Module } from '@nestjs/common';
import { WearablesController } from './wearables.controller';
import { HabitsModule } from '../habits/habits.module';

@Module({
  imports: [HabitsModule],
  controllers: [WearablesController],
})
export class WearablesModule {}
