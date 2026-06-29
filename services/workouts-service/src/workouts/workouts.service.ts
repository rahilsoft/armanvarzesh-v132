import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateWorkoutPlanInput } from './dto/create-workout-plan.input';
import { UpdateWorkoutPlanInput } from './dto/update-workout-plan.input';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { UpdateExerciseInput } from './dto/update-exercise.input';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { UpdateWorkoutInput } from './dto/update-workout.input';

/**
 * Service exposing CRUD operations for workout plans, exercises and workout
 * sessions, plus aggregated progress metrics. Backed directly by Prisma.
 */
@Injectable()
export class WorkoutsService {
  private prisma = new PrismaClient();

  /*** Workout Plans ***/

  findPlans(): Promise<any> {
    return this.prisma.workoutPlan.findMany({
      include: { exercises: true, workouts: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPlan(id: number): Promise<any> {
    return this.prisma.workoutPlan.findUnique({
      where: { id },
      include: { exercises: true, workouts: true },
    });
  }

  createPlan(input: CreateWorkoutPlanInput): Promise<any> {
    return this.prisma.workoutPlan.create({
      data: { name: input.name, description: input.description, userId: input.userId },
    });
  }

  updatePlan(id: number, input: UpdateWorkoutPlanInput): Promise<any> {
    const { id: _ignored, ...data } = input;
    return this.prisma.workoutPlan.update({ where: { id }, data });
  }

  async deletePlan(id: number): Promise<boolean> {
    await this.prisma.workoutPlan.delete({ where: { id } });
    return true;
  }

  /*** Exercises ***/

  findExercisesByPlan(planId: number): Promise<any> {
    return this.prisma.exercise.findMany({ where: { planId }, orderBy: { createdAt: 'asc' } });
  }

  searchExercises(term: string): Promise<any> {
    return this.prisma.exercise.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,
    });
  }

  createExercise(input: CreateExerciseInput): Promise<any> {
    return this.prisma.exercise.create({ data: { ...input } });
  }

  updateExercise(id: number, input: UpdateExerciseInput): Promise<any> {
    const { id: _ignored, ...data } = input;
    return this.prisma.exercise.update({ where: { id }, data });
  }

  async deleteExercise(id: number): Promise<boolean> {
    await this.prisma.exercise.delete({ where: { id } });
    return true;
  }

  /*** Workout Sessions ***/

  findWorkouts(): Promise<any> {
    return this.prisma.workout.findMany({ orderBy: { date: 'desc' } });
  }

  findWorkoutsByUser(userId: number): Promise<any> {
    return this.prisma.workout.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }

  findWorkout(id: number): Promise<any> {
    return this.prisma.workout.findUnique({ where: { id } });
  }

  createWorkout(input: CreateWorkoutInput): Promise<any> {
    return this.prisma.workout.create({ data: { ...input } });
  }

  updateWorkout(id: number, input: UpdateWorkoutInput): Promise<any> {
    const { id: _ignored, ...data } = input;
    return this.prisma.workout.update({ where: { id }, data });
  }

  async deleteWorkout(id: number): Promise<boolean> {
    await this.prisma.workout.delete({ where: { id } });
    return true;
  }

  /*** REST aliases (used by WorkoutsController) ***/

  list(_q?: string): Promise<any> {
    return this.findWorkouts();
  }

  get(id: string | number): Promise<any> {
    return this.findWorkout(Number(id));
  }

  create(input: any): Promise<any> {
    return this.createWorkout(input);
  }

  /*** Progress ***/

  /**
   * Aggregate a user's workouts into total count, total training volume
   * (sets × reps × weight) and average perceived exertion (RPE).
   */
  async getProgressByUser(userId: number): Promise<{ totalWorkouts: number; totalVolume: number; averageRpe?: number }> {
    const workouts = await this.prisma.workout.findMany({ where: { userId } });
    let totalVolume = 0;
    let rpeSum = 0;
    let rpeCount = 0;
    for (const w of workouts) {
      const sets = w.sets ?? 0;
      const reps = w.reps ?? 0;
      const weight = w.weight ?? 0;
      totalVolume += sets * reps * weight;
      if (typeof w.rpe === 'number') {
        rpeSum += w.rpe;
        rpeCount += 1;
      }
    }
    return {
      totalWorkouts: workouts.length,
      totalVolume,
      averageRpe: rpeCount > 0 ? rpeSum / rpeCount : undefined,
    };
  }
}
