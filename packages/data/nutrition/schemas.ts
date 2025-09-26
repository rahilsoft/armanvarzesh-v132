export type Food = { id:string; name:string; kcal:number; protein:number; carb:number; fat:number; unit:'g'|'ml'|'piece' };
export type Meal = { id:string; title:string; items: { foodId:string; amount:number }[]; totalKcal:number };
