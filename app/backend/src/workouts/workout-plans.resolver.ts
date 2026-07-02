import { Resolver, Query, Mutation, Args, Int, ObjectType, Field, Float } from '@nestjs/graphql';
import { WorkoutPlansService } from './workout-plans.service';
import { WorkoutPlan } from './entities/workout-plan.entity';
import { Exercise } from './entities/exercise.entity';
import { CreateWorkoutPlanInput, UpdateWorkoutPlanInput } from './dto/workout-plan.input';
import { CreateExerciseInput, UpdateExerciseInput } from './dto/exercise.input';

@ObjectType()
export class UserProgressResult {
  @Field(() => Int)
  totalWorkouts!: number;

  @Field(() => Float)
  totalVolume!: number;

  @Field(() => Float, { nullable: true })
  averageRpe!: number | null;
}

@Resolver(() => WorkoutPlan)
export class WorkoutPlansResolver {
  constructor(private readonly plans: WorkoutPlansService) {}

  @Query(() => [WorkoutPlan])
  workoutPlans() {
    return this.plans.findPlans();
  }

  @Query(() => WorkoutPlan, { nullable: true })
  workoutPlan(@Args('id', { type: () => Int }) id: number) {
    return this.plans.findPlan(id);
  }

  @Query(() => [Exercise])
  exercisesByPlan(@Args('planId', { type: () => Int }) planId: number) {
    return this.plans.findExercisesByPlan(planId);
  }

  @Query(() => [Exercise])
  searchExercises(@Args('term') term: string) {
    return this.plans.searchExercises(term);
  }

  @Query(() => UserProgressResult)
  userWorkoutProgress(@Args('userId', { type: () => Int }) userId: number) {
    return this.plans.getProgressByUser(userId);
  }

  @Mutation(() => WorkoutPlan)
  createWorkoutPlan(@Args('input') input: CreateWorkoutPlanInput) {
    return this.plans.createPlan(input);
  }

  @Mutation(() => WorkoutPlan)
  updateWorkoutPlan(@Args('input') input: UpdateWorkoutPlanInput) {
    return this.plans.updatePlan(input.id, input);
  }

  @Mutation(() => Boolean)
  deleteWorkoutPlan(@Args('id', { type: () => Int }) id: number) {
    return this.plans.deletePlan(id);
  }

  @Mutation(() => Exercise)
  createExercise(@Args('input') input: CreateExerciseInput) {
    return this.plans.createExercise(input);
  }

  @Mutation(() => Exercise)
  updateExercise(@Args('input') input: UpdateExerciseInput) {
    return this.plans.updateExercise(input.id, input);
  }

  @Mutation(() => Boolean)
  deleteExercise(@Args('id', { type: () => Int }) id: number) {
    return this.plans.deleteExercise(id);
  }
}
