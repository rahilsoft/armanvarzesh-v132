
import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '@arman/shared';
import * as client from 'prom-client';
import { HabitsService } from '../habits/habits.service';
import { HabitType } from '@prisma/client';

const ingestDto = z.object({
  provider: z.enum(['healthkit','googlefit']),
  datapoints: z.array(z.object({
    type: z.enum(['steps','heartRate','calories','water']),
    value: z.number(),
    at: z.string().datetime(),
  })),
});

const register = new client.Registry();
const wearableLag = new client.Gauge({
  name: 'wearable_ingestion_lag_seconds',
  help: 'Lag between event time and ingestion',
});
register.registerMetric(wearableLag);

@ApiTags('wearables')
@ApiBearerAuth()
@Controller('v1/wearables')
export class WearablesController {
  constructor(private readonly habits: HabitsService) {}

  @Post('ingest')
  async ingest(@Body(new ZodValidationPipe(ingestDto)) body: any, @Req() req: any) {
    const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);
    const now = Date.now();
    for (const dp of body.datapoints) {
      const at = new Date(dp.at);
      const lag = (now - at.getTime())/1000;
      wearableLag.set(lag);

      // map to habits so that Today card aggregates include these
      if (dp.type === 'water') {
        // Upsert water habit if missing? keep simple: find existing water habit by user is complex here.
        // We just log against the first active water habit; otherwise create one.
        // For production, we would maintain mapping. Here: minimum viable ingestion.
        try {
          const today = await this.habits.getToday(userId);
          const water = (today.items||[]).find((x:any)=> x.habit.type === 'water')?.habit;
          if (water) {
            await this.habits.logHabit({ habitId: water.id, occurredAt: at, value: dp.value, meta: { source: body.provider } });
          }
        } catch(e) { /* swallow */ }
      }
      if (dp.type === 'steps') {
        try {
          const today = await this.habits.getToday(userId);
          let stepsHabit = (today.items||[]).find((x:any)=> x.habit.type === 'steps')?.habit;
          if (!stepsHabit) {
            const created = await this.habits.createHabit({ userId, type: HabitType.steps, target: 10000, cadence: { daily:true }, tz: 'UTC' });
            stepsHabit = created.habit;
          }
          await this.habits.logHabit({ habitId: stepsHabit.id, occurredAt: at, value: dp.value, meta: { source: body.provider } });
        } catch(e) { /* swallow */ }
      }
      // heartRate/calories could be persisted in future specific tables; for now record as meta logs if needed
    }
    return { ok: true, count: body.datapoints.length };
  }
}
