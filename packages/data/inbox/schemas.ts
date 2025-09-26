export type InboxThread = { id:string; subject:string; unread:number; lastAt:string };
export type InboxItem = { id:string; threadId:string; title:string; body:string; at:string; read?:boolean };
