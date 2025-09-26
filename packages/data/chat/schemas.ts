export type ChatUser = { id:string; name:string; role:'user'|'coach'|'admin' };
export type ChatMsg = { id:string; from:string; to?:string; room?:string; kind:'text'|'image'|'audio'|'video'; body:string; at:string };
export type ChatRoom = { id:string; title:string; members:string[]; lastAt?:string; lastMsg?:string };
