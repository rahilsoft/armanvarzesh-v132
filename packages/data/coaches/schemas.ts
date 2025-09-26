export type Coach = {
  id:string; name:string; avatar?:string; gender?:'male'|'female'|'other';
  tags:string[]; rating:number; price:number; currency:'IRT'|'EUR';
  experience:number; bio?:string; languages?:string[]; slots?:string[];
};
export type CoachFilter = { q?:string; gender?:'male'|'female'|'other'|'any'; tags?:string[]; priceMax?:number; ratingMin?:number };
