export type Review = { id:string; coachId:string; userId:string; stars:number; comment?:string; at:string; status:'published'|'hidden'|'pending' };
