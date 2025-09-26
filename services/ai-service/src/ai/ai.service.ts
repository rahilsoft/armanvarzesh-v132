import { Injectable } from '@nestjs/common';
import { WorkoutRecommendation } from './entities/workout-recommendation.entity';

/**
 * Service providing AI-based workout recommendations. In this initial
 * implementation, recommendations are rule-based and depend on the
 * user's fitness level or simple heuristics. In a production system,
 * this service could integrate with machine learning models and other
 * microservices to generate personalized plans.
 */
@Injectable()
export class AiService {
  /**
   * Generate a basic workout plan for the given user. The plan consists
   * of a few exercises tailored according to a hypothetical fitness level
   * inferred from the user ID (for demonstration purposes only).
   *
   * @param userId The identifier of the user to generate a workout plan for.
   */
  async generateWorkoutPlan(userId: number): Promise<WorkoutRecommendation[]> {
    // In a real implementation, fetch the user's profile and workout
    // history from other services and apply recommendation logic.
    // Here we return a simple static plan that varies based on userId.
    const level = userId % 3;
    if (level === 0) {
      return [
        { exerciseName: 'Push-up', sets: 3, reps: 12, weight: 0 },
        { exerciseName: 'Bodyweight Squat', sets: 3, reps: 15, weight: 0 },
        { exerciseName: 'Plank', sets: 3, reps: 60, weight: 0 },
      ];
    } else if (level === 1) {
      return [
        { exerciseName: 'Bench Press', sets: 4, reps: 10, weight: 40 },
        { exerciseName: 'Deadlift', sets: 4, reps: 8, weight: 60 },
        { exerciseName: 'Pull-up', sets: 3, reps: 8, weight: 0 },
      ];
    } else {
      return [
        { exerciseName: 'Overhead Press', sets: 5, reps: 5, weight: 30 },
        { exerciseName: 'Barbell Row', sets: 5, reps: 5, weight: 50 },
        { exerciseName: 'Back Squat', sets: 5, reps: 5, weight: 70 },
      ];
    }
  }

  /**
   * Generate a simple nutrition plan for the given user. This
   * implementation uses placeholder logic based on the userId to
   * demonstrate how recommendations could vary. In a real system, this
   * would take into account the user's nutrition goals, dietary
   * preferences and meal history.
   */
  async generateNutritionPlan(userId: number) {
    const level = userId % 3;
    if (level === 0) {
      return [
        { foodName: 'Grilled Chicken Breast', servings: 2, calories: 300, protein: 60, carbs: 0, fats: 6 },
        { foodName: 'Brown Rice', servings: 1.5, calories: 165, protein: 4, carbs: 34, fats: 1.5 },
        { foodName: 'Steamed Broccoli', servings: 2, calories: 110, protein: 7, carbs: 22, fats: 1 },
      ];
    } else if (level === 1) {
      return [
        { foodName: 'Oatmeal with Berries', servings: 1, calories: 250, protein: 8, carbs: 45, fats: 4 },
        { foodName: 'Greek Yogurt', servings: 1, calories: 100, protein: 17, carbs: 6, fats: 0 },
        { foodName: 'Mixed Nuts', servings: 0.5, calories: 200, protein: 5, carbs: 7, fats: 18 },
      ];
    } else {
      return [
        { foodName: 'Salmon Fillet', servings: 1, calories: 233, protein: 25, carbs: 0, fats: 14 },
        { foodName: 'Quinoa', servings: 1, calories: 222, protein: 8, carbs: 39, fats: 3.5 },
        { foodName: 'Avocado', servings: 0.5, calories: 120, protein: 1.5, carbs: 6, fats: 10 },
      ];
    }
  }
}