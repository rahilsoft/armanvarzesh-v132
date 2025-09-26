export type Program = { id:string; title:string; weeks:number; plan: { day:number; workoutId:string }[]; level:'beginner'|'intermediate'|'advanced' };
