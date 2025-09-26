
import { Test, TestingModule } from '@nestjs/testing';
import { AIWorkoutService } from '../../src/ai/ai-workout.service';
import { NutritionService } from '../../src/nutrition/nutrition.service';

describe('AI-Nutrition Integration', () => {
  let aiService: AIWorkoutService;
  let nutritionService: NutritionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIWorkoutService, NutritionService],
    }).compile();
    aiService = module.get<AIWorkoutService>(AIWorkoutService);
    nutritionService = module.get<NutritionService>(NutritionService);
  });

  it('should suggest nutrition plan based on AI analysis', async () => {
    const profile = { age: 28, goal: "fat-loss", activityLevel: "medium" };
    const aiSuggestion = await aiService.analyzeProfile(profile);
    const plan = await nutritionService.create({ title: aiSuggestion.title, calories: aiSuggestion.calories });
    expect(plan.title).toBeDefined();
    expect(plan.calories).toBeGreaterThan(0);
  });
});
