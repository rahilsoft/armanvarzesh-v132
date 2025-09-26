import { User } from '../users/entities/user.entity';
import { PrismaService } from '../database/prisma.service';
import { LoaderFactory } from '@arman/graphql-dataloader';

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResolveField, Parent } from '@nestjs/graphql';
import { WorkoutsService } from './workouts.service';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { UpdateWorkoutInput } from './dto/update-workout.input';

@Resolver(() => Workout)
export class WorkoutsResolver {
  constructor(private readonly workoutsService: WorkoutsService, private readonly prisma: PrismaService, private readonly loaderFactory: LoaderFactory) {}

  private readonly userById = this.loaderFactory.create<number, any>(async (ids) => {
    const users = await this.prisma.user.findMany({ where: { id: { in: ids as number[] } } });
    const map = new Map(users.map(u => [u.id, u]));
    return (ids as number[]).map(id => map.get(id) ?? null);
  });
@Query(() => [Workout])
  async workouts() {
    return this.workoutsService.findAll();
  }

  @Query(() => [Workout])
  async userWorkouts(@Args('userId', { type: () => Int }) userId: number) {
    return this.workoutsService.findAllByUser(userId);
  }

  @Query(() => Workout, { nullable: true })
  async workout(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.findOne(id);
  }

  @Mutation(() => Workout)
  async createWorkout(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: CreateWorkoutInput
  ) {
    return this.workoutsService.create(userId, input);
  }

  @Mutation(() => Workout)
  async updateWorkout(@Args('id', { type: () => Int }) id: number, @Args('input') input: UpdateWorkoutInput) {
    return this.workoutsService.update(id, input);
  }

  /**
   * Delete a workout by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteWorkout(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.delete(id);
  }

  /**
   * Log the actual performance data for a workout, such as sets, reps, weight, RPE and notes.
   * This delegates to the service's logActual method and returns the updated workout.
   */
  @Mutation(() => Workout)
  async logActual(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateWorkoutInput
  ) {
    return this.workoutsService.logActual(id, input);
  }
}

@ResolveField(() => User, { name: 'user', nullable: true })
user(@Parent() item: Workout) {
  return this.userById.load(item.userId);
}
