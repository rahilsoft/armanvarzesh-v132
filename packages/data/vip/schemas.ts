export type VipTier = { id:string; name:'Bronze'|'Silver'|'Gold'|'Platinum'; threshold:number; benefits:string[] };
export type VipState = { tier:VipTier; progress:number; next?:VipTier };
