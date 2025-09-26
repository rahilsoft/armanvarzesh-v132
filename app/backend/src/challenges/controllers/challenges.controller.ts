
import { Controller, Get, Param } from '@nestjs/common';
import { ChallengesService } from '../challenges.service';
import { Challenge } from '../entities/challenge.entity';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengesService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Challenge> {
    return this.challengesService.findOne(Number(id));
  }
}