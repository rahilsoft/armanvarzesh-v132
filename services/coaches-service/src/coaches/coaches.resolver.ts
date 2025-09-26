import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoachesService } from './coaches.service';
import { Coach } from './entities/coach.entity';
import { CreateCoachInput } from './dto/create-coach.input';
import { UpdateCoachInput } from './dto/update-coach.input';

/**
 * GraphQL resolver exposing CRUD operations for coaches as well as
 * a verification mutation. The service methods are invoked to
 * perform the underlying persistence logic.
 */
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

  @Mutation(() => Coach, { nullable: true })
  async updateCoach(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCoachInput
  ) {
    return this.coachesService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteCoach(@Args('id', { type: () => Int }) id: number) {
    return this.coachesService.delete(id);
  }

  @Mutation(() => Coach, { nullable: true })
  async verifyCoach(@Args('id', { type: () => Int }) id: number) {
    return this.coachesService.verify(id);
  }
}