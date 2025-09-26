export type Wallet = { balance:number; currency:'IRT'|'EUR'|'USD' };
export type WalletTxn = { id:string; type:'in'|'out'; amount:number; currency:'IRT'|'EUR'|'USD'; ref:string; at:string };
