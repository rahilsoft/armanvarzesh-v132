
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoachesService } from './coaches.service';
import { Coach } from './entities/coach.entity';
import { CreateCoachInput } from './dto/create-coach.input';

@Resolver(() => Coach)
export class CoachesResolver {
  constructor(private readonly coachesService: CoachesService) {}

  @Query(() => [Coach])
  async coaches() {
    return this.coachesService.findAll();
  }

  @Query(() => Coach, { nullable: true })
  async coach(@Args('id', { type: () => Int }) id: number) {
    return this.coachesService.findOne(id);
  }

  @Mutation(() => Coach)
  async createCoach(@Args('input') input: CreateCoachInput) {
    return this.coachesService.create(input);
  }

  /**
   * Update an existing coach. Only provided fields will be changed.
   */
  @Mutation(() => Coach)
  async updateCoach(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: CreateCoachInput
  ) {
    return this.coachesService.update(id, input);
  }

  /**
   * Delete a coach by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteCoach(@Args('id', { type: () => Int }) id: number) {
    return this.coachesService.delete(id);
  }
}
