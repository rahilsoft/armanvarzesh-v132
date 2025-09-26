export type Money = { amount:number; currency:'IRT'|'EUR'|'USD' };
export type PaymentIntent = { id:string; amount:Money; status:'requires_payment'|'processing'|'succeeded'|'failed'; clientSecret?:string };
export type CardToken = { id:string; brand:'visa'|'mastercard'|'local'; last4:string; exp:string };
export type Settlement = { id:string; at:string; total:number; currency:'IRT'|'EUR'|'USD'; count:number; status:'pending'|'paid' };
