import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PlansService } from '../plans.service';

/**
 * REST controller for nutrition plans.  Exposes endpoints to
 * retrieve all plans for a particular user and to create a new
 * plan.  Plans are stored in-memory by the PlansService.
 */
@Controller('nutrition/plans')
export class PlanController {
  constructor(private readonly plansService: PlansService) {}

  /**
   * Get all nutrition plans associated with a user ID.
   */
  @Get('user/:id')
  getForUser(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.findByUser(id);
  }

  /**
   * Create a new nutrition plan.  Expects an object with
   * ``userId`` and an array of ``items`` (each containing
   * ``foodId`` and ``grams``).  Returns the created plan.
   */
  @Post()
  create(@Body() body: { userId: number; items: { foodId: number; grams: number }[] }) {
    return this.plansService.create(body);
  }
}