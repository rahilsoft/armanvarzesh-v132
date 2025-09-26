export type MealPlan = { id:string; title:string; days: { day:number; mealIds:string[] }[]; kcalTarget:number };
