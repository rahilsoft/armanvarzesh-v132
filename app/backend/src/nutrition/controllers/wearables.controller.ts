import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsISO8601, IsNumber, ValidateNested } from 'class-validator';
import client from 'prom-client';
import { HabitType, Prisma } from '@prisma/client';
import { HabitsService } from '../habits.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { CurrentUser, AuthPrincipal } from '../../common/auth/current-user.decorator';

/**
 * Wearable data ingestion (folded from services/nutrition-service). Maps
 * water/steps datapoints onto the user's habits so the Today card aggregates
 * include them. heartRate/calories datapoints are accepted but not persisted
 * here — continuous telemetry belongs to the Activity domain (ADR-B9).
 * The original's zod pipe (via undeclared @arman/shared) is replaced with
 * class-validator, the monolith's standard. User identity comes from the JWT —
 * the former x-user-id header / query fallback (an impersonation hole) is gone.
 */

enum WearableProvider { healthkit = 'healthkit', googlefit = 'googlefit' }
enum DatapointType { steps = 'steps', heartRate = 'heartRate', calories = 'calories', water = 'water' }

class WearableDatapointDto {
  @IsEnum(DatapointType) type!: DatapointType;
  @IsNumber() value!: number;
  @IsISO8601() at!: string;
}

class IngestDto {
  @IsEnum(WearableProvider) provider!: WearableProvider;
  @IsArray() @ValidateNested({ each: true }) @Type(() => WearableDatapointDto)
  datapoints!: WearableDatapointDto[];
}

const wearableLag = new client.Gauge({
  name: 'wearable_ingestion_lag_seconds',
  help: 'Lag between event time and ingestion',
});

@Controller('v1/wearables')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class WearablesController {
  constructor(private readonly habits: HabitsService) {}

  @Post('ingest')
  async ingest(@CurrentUser() user: AuthPrincipal, @Body() body: IngestDto) {
    const userId = user.userId;
    const now = Date.now();
    let logged = 0;
    const meta: Prisma.InputJsonValue = { source: body.provider };
    for (const dp of body.datapoints) {
      const at = new Date(dp.at);
      wearableLag.set((now - at.getTime()) / 1000);

      if (dp.type === DatapointType.water || dp.type === DatapointType.steps) {
        const wanted = dp.type === DatapointType.water ? HabitType.water : HabitType.steps;
        const today = await this.habits.getToday(userId);
        let habit = today.items.find((x) => x.habit.type === wanted)?.habit;
        if (!habit && wanted === HabitType.steps) {
          habit = await this.habits.createHabit({ userId, type: wanted, target: 10000, cadence: { daily: true }, tz: 'UTC' });
        }
        if (habit) {
          await this.habits.logHabit({ habitId: habit.id, occurredAt: at, value: dp.value, meta });
          logged++;
        }
      }
      // heartRate / calories: Activity-domain telemetry, not persisted here (ADR-B9).
    }
    return { ok: true, received: body.datapoints.length, logged };
  }
}
