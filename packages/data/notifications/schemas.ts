export type PushDevice = { token:string; platform:'web'|'ios'|'android'; lang?:string; userId?:string };
export type Notification = { id:string; title:string; body:string; kind:'system'|'promo'|'reminder'; at:string; read?:boolean };
export type Prefs = { push:boolean; email:boolean; sms:boolean; categories: Record<string, boolean> };
