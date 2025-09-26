
import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HydrationService } from './hydration.service';
import { ZodValidationPipe } from '@arman/shared';
import { z } from 'zod';

const createDto = z.object({
  ml: z.number().int().min(10).max(10000),
  occurredAt: z.string().datetime().optional(), // ISO string
  source: z.string().max(64).optional(),
});

@ApiTags('health/hydration')
@ApiBearerAuth()
@Controller('v1/health/hydration')
export class HydrationController {
  constructor(private readonly svc: HydrationService) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createDto)) body: z.infer<typeof createDto>, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || req.query.userId;
    return this.svc.create({
      userId: Number(userId),
      ml: body.ml,
      occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
      source: body.source || 'manual',
    });
  }

  @Get()
  async range(@Query('from') from?: string, @Query('to') to?: string, @Req() req?: any) {
    const userId = req?.user?.id || req?.headers?.['x-user-id'] || req?.query?.userId;
    const fromDt = from ? new Date(from) : new Date(Date.now() - 7*24*3600*1000);
    const toDt = to ? new Date(to) : new Date();
    return this.svc.getRange(Number(userId), fromDt, toDt);
  }
}
