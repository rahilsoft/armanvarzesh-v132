export type Course = { id:string; title:string; coach:string; level:'beginner'|'intermediate'|'advanced'; durationMin:number; lessons:{ id:string; title:string; durMin:number }[] };
