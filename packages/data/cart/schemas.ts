export type CartItem = { productId:string; qty:number; price:number; title:string; currency:'IRT'|'EUR' };
export type Cart = { items: CartItem[]; subtotal:number; currency:'IRT'|'EUR' };
