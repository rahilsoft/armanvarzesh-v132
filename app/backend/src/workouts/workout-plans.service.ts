import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WorkoutPlan as PrismaWorkoutPlan, Exercise as PrismaExercise } from '@prisma/client';
import { CreateWorkoutPlanInput, UpdateWorkoutPlanInput } from './dto/workout-plan.input';
import { CreateExerciseInput, UpdateExerciseInput } from './dto/exercise.input';

/** Aggregated training metrics for a user (volume = sets × reps × weight). */
export interface UserProgress {
  totalWorkouts: number;
  totalVolume: number;
  averageRpe: number | null;
}

/**
 * Workout plans, exercises and progress aggregation — folded from the former
 * services/workouts-service into the modular monolith. Behaviour-preserving
 * port with the original's `Promise<any>` signatures replaced by real types and
 * its private `new PrismaClient()` replaced by the injected PrismaService.
 */
@Injectable()
export class WorkoutPlansService {
  constructor(private readonly prisma: PrismaService) {}

  /*** Workout plans ***/

  findPlans(): Promise<PrismaWorkoutPlan[]> {
    return this.prisma.workoutPlan.findMany({
      include: { exercises: true, workouts: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPlan(id: number): Promise<PrismaWorkoutPlan | null> {
    return this.prisma.workoutPlan.findUnique({
      where: { id },
      include: { exercises: true, workouts: true },
    });
  }

  createPlan(input: CreateWorkoutPlanInput): Promise<PrismaWorkoutPlan> {
    return this.prisma.workoutPlan.create({
      data: { name: input.name, description: input.description, userId: input.userId },
    });
  }

  updatePlan(id: number, input: UpdateWorkoutPlanInput): Promise<PrismaWorkoutPlan> {
    const { id: _ignored, ...data } = input;
    return this.prisma.workoutPlan.update({ where: { id }, data });
  }

  async deletePlan(id: number): Promise<boolean> {
    await this.prisma.workoutPlan.delete({ where: { id } });
    return true;
  }

  /*** Exercises ***/

  findExercisesByPlan(planId: number): Promise<PrismaExercise[]> {
    return this.prisma.exercise.findMany({ where: { planId }, orderBy: { createdAt: 'asc' } });
  }

  searchExercises(term: string): Promise<PrismaExercise[]> {
    return this.prisma.exercise.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,
    });
  }

  async createExercise(input: CreateExerciseInput): Promise<PrismaExercise> {
    const plan = await this.prisma.workoutPlan.findUnique({ where: { id: input.planId } });
    if (!plan) throw new NotFoundException('WORKOUT_PLAN_NOT_FOUND');
    return this.prisma.exercise.create({ data: { ...input } });
  }

  updateExercise(id: number, input: UpdateExerciseInput): Promise<PrismaExercise> {
    const { id: _ignored, ...data } = input;
    return this.prisma.exercise.update({ where: { id }, data });
  }

  async deleteExercise(id: number): Promise<boolean> {
    await this.prisma.exercise.delete({ where: { id } });
    return true;
  }

  /*** Progress ***/

  /**
   * Aggregate a user's workouts into total count, total training volume
   * (sets × reps × weight) and average perceived exertion (RPE).
   */
  async getProgressByUser(userId: number): Promise<UserProgress> {
    const workouts = await this.prisma.workout.findMany({ where: { userId } });
    let totalVolume = 0;
    let rpeSum = 0;
    let rpeCount = 0;
    for (const w of workouts) {
      totalVolume += (w.sets ?? 0) * (w.reps ?? 0) * (w.weight ?? 0);
      if (typeof w.rpe === 'number') {
        rpeSum += w.rpe;
        rpeCount += 1;
      }
    }
    return {
      totalWorkouts: workouts.length,
      totalVolume,
      averageRpe: rpeCount > 0 ? rpeSum / rpeCount : null,
    };
  }
}
