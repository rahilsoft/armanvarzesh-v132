export type Exercise = { id:string; name:string; type:'strength'|'cardio'|'mobility'; defaultReps?:number; defaultSets?:number };
export type Workout = { id:string; title:string; exercises: { exerciseId:string; sets:number; reps:number }[]; estDurationMin:number; level:'beginner'|'intermediate'|'advanced' };
export type Session = { id:string; workoutId:string; startedAt:string; completedAt?:string; logs: { exId:string; set:number; reps:number; weight?:number }[] };
