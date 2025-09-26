/** Contracts for Nutrition domain */
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  userId: string;
  date: string; // ISO date YYYY-MM-DD
  items: Array<{ itemId: string; grams: number }>;
  createdAt: string; // ISO timestamp
}

export interface MealPlan {
  id: string;
  userId: string;
  targets?: MacroTargets;
  items: Array<{ itemId: string; grams: number }>;
  createdAt: string;
}

export interface NutritionService {
  getMealPlan(userId: string): Promise<MealPlan | null>;
  setMealPlan(userId: string, plan: MealPlan): Promise<void>;
  addMealEntry(userId: string, entry: MealEntry): Promise<void>;
  listMeals(userId: string, from?: string, to?: string): Promise<MealEntry[]>;
  computeDailyMacros(userId: string, date: string): Promise<MacroTargets>;
}
