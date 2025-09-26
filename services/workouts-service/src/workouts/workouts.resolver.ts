import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkoutsService } from './workouts.service';
import { WorkoutPlan } from './entities/workout-plan.entity';
import { Exercise } from './entities/exercise.entity';
import { Workout } from './entities/workout.entity';
import { CreateWorkoutPlanInput } from './dto/create-workout-plan.input';
import { UpdateWorkoutPlanInput } from './dto/update-workout-plan.input';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { UpdateExerciseInput } from './dto/update-exercise.input';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { UpdateWorkoutInput } from './dto/update-workout.input';
import { WorkoutProgress } from './entities/workout-progress.entity';

/**
 * GraphQL resolver exposing operations for workout plans, exercises and
 * workout sessions. Each method delegates to the WorkoutsService.
 */
@Resolver()
export class WorkoutsResolver {
  constructor(private readonly workoutsService: WorkoutsService) {}

  /*** Workout Plan Resolvers ***/

  @Query(() => [WorkoutPlan])
  async workoutPlans() {
    return this.workoutsService.findPlans();
  }

  @Query(() => WorkoutPlan, { nullable: true })
  async workoutPlan(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.findPlan(id);
  }

  @Mutation(() => WorkoutPlan)
  async createWorkoutPlan(@Args('input') input: CreateWorkoutPlanInput) {
    return this.workoutsService.createPlan(input);
  }

  @Mutation(() => WorkoutPlan, { nullable: true })
  async updateWorkoutPlan(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateWorkoutPlanInput
  ) {
    return this.workoutsService.updatePlan(id, input);
  }

  @Mutation(() => Boolean)
  async deleteWorkoutPlan(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.deletePlan(id);
  }

  /*** Exercise Resolvers ***/

  @Query(() => [Exercise])
  async exercisesByPlan(@Args('planId', { type: () => Int }) planId: number) {
    return this.workoutsService.findExercisesByPlan(planId);
  }

  /**
   * Search for exercises by name. Performs a case-insensitive match
   * against the name field.
   */
  @Query(() => [Exercise])
  async searchExercises(@Args('term') term: string) {
    return this.workoutsService.searchExercises(term);
  }

  @Mutation(() => Exercise)
  async createExercise(@Args('input') input: CreateExerciseInput) {
    return this.workoutsService.createExercise(input);
  }

  @Mutation(() => Exercise, { nullable: true })
  async updateExercise(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateExerciseInput
  ) {
    return this.workoutsService.updateExercise(id, input);
  }

  @Mutation(() => Boolean)
  async deleteExercise(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.deleteExercise(id);
  }

  /*** Workout Session Resolvers ***/

  @Query(() => [Workout])
  async workouts() {
    return this.workoutsService.findWorkouts();
  }

  @Query(() => [Workout])
  async workoutsByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.workoutsService.findWorkoutsByUser(userId);
  }

  @Query(() => Workout, { nullable: true })
  async workout(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.findWorkout(id);
  }

  @Mutation(() => Workout)
  async createWorkout(@Args('input') input: CreateWorkoutInput) {
    return this.workoutsService.createWorkout(input);
  }

  @Mutation(() => Workout, { nullable: true })
  async updateWorkout(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateWorkoutInput
  ) {
    return this.workoutsService.updateWorkout(id, input);
  }

  @Mutation(() => Boolean)
  async deleteWorkout(@Args('id', { type: () => Int }) id: number) {
    return this.workoutsService.deleteWorkout(id);
  }

  /**
   * Compute aggregated progress metrics for a given user. Delegates
   * to the service which calculates total workouts, total volume and
   * average perceived exertion.
   */
  @Query(() => WorkoutProgress)
  async workoutProgress(@Args('userId', { type: () => Int }) userId: number) {
    return this.workoutsService.getProgressByUser(userId);
  }
}