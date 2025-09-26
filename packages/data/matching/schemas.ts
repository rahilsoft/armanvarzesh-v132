export type MatchInput = { goal:'weight-loss'|'muscle'|'mobility'|'endurance'; genderPref?:'male'|'female'|'any'; priceMax?:number; langs?:string[]; tags?:string[] };
export type MatchResult = { coachId:string; score:number };
