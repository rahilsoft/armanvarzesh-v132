export type RewardEntry = { id:string; type:'earn'|'redeem'; points:number; at:string; note?:string };
export type Rewards = { balance:number; history:RewardEntry[] };
